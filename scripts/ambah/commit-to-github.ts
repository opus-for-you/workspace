#!/usr/bin/env tsx
/**
 * Script to commit all code and documentation to GitHub
 * Run with: tsx scripts/commit-to-github.ts
 */

import { getUncachableGitHubClient } from '../server/lib/github';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

// Files and directories to exclude
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  '.replit',
  '.config',
  '.cache',
  '.upm',
  'replit.nix',
  '.gitignore',
  'package-lock.json',
];

function shouldExclude(path: string): boolean {
  return EXCLUDE_PATTERNS.some(pattern => path.includes(pattern));
}

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = join(dirPath, file);
    
    if (shouldExclude(fullPath)) {
      return;
    }

    if (statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

async function commitToGitHub() {
  try {
    const octokit = await getUncachableGitHubClient();
    
    // Get authenticated user
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`Authenticated as: ${user.login}`);
    
    // Get the repository name from the current directory
    const repoName = process.env.REPL_SLUG || 'opus';
    const owner = user.login;
    
    console.log(`\nAttempting to work with repository: ${owner}/${repoName}`);
    
    // Check if repository exists, create if it doesn't
    let repo;
    try {
      const { data } = await octokit.repos.get({
        owner,
        repo: repoName,
      });
      repo = data;
      console.log(`Repository found: ${repo.full_name}`);
    } catch (error: any) {
      if (error.status === 404) {
        console.log(`Repository not found. Creating new repository: ${repoName}`);
        const { data } = await octokit.repos.createForAuthenticatedUser({
          name: repoName,
          description: 'Opus - Personal and Client Management App',
          private: false,
          auto_init: true,
        });
        repo = data;
        console.log(`Repository created: ${repo.full_name}`);
      } else {
        throw error;
      }
    }
    
    // Get the latest commit SHA from the default branch
    const { data: ref } = await octokit.git.getRef({
      owner,
      repo: repoName,
      ref: `heads/${repo.default_branch}`,
    });
    
    const latestCommitSha = ref.object.sha;
    console.log(`Latest commit SHA: ${latestCommitSha}`);
    
    // Get the tree SHA from the latest commit
    const { data: commit } = await octokit.git.getCommit({
      owner,
      repo: repoName,
      commit_sha: latestCommitSha,
    });
    
    // Get all files from the project
    console.log('\nCollecting project files...');
    const projectRoot = process.cwd();
    const allFiles = getAllFiles(projectRoot);
    
    // Create file objects with content
    const files = allFiles.map(filePath => {
      const relativePath = relative(projectRoot, filePath);
      const content = readFileSync(filePath, 'utf-8');
      return { path: relativePath, content };
    });
    
    console.log(`Found ${files.length} files to commit`);
    
    // Add README if it doesn't exist
    const hasReadme = files.some(f => f.path === 'README.md');
    if (!hasReadme) {
      files.push({
        path: 'README.md',
        content: `# Opus - Personal and Client Management App

A full-stack productivity application for young professionals to manage their personal and professional lives.

## Features
- 🔐 Secure authentication with session management
- 📊 Dashboard with metrics and overview
- 👥 Connections management for professional relationships
- 🎯 Goals tracking with progress indicators
- ✅ Task management with priorities
- 📝 Weekly review and reflection

## Tech Stack
- **Frontend**: React 18 + TypeScript + TailwindCSS + shadcn/ui
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with session-based auth

## Getting Started
\`\`\`bash
npm install
npm run dev
\`\`\`

## Environment Variables
- \`DATABASE_URL\`: PostgreSQL connection string
- \`SESSION_SECRET\`: Secret for session encryption

See \`replit.md\` for complete documentation.
`
      });
    }
    
    // Create blobs for each file
    console.log('\nUploading files to GitHub...');
    const blobs = await Promise.all(
      files.map(async (file, index) => {
        if (index % 20 === 0) {
          console.log(`  Processed ${index}/${files.length} files...`);
        }
        const { data: blob } = await octokit.git.createBlob({
          owner,
          repo: repoName,
          content: Buffer.from(file.content).toString('base64'),
          encoding: 'base64',
        });
        return { 
          path: file.path, 
          sha: blob.sha, 
          mode: '100644' as const, 
          type: 'blob' as const 
        };
      })
    );
    
    console.log(`  Processed ${files.length}/${files.length} files ✓`);
    
    // Create a new tree
    console.log('\nCreating commit tree...');
    const { data: newTree } = await octokit.git.createTree({
      owner,
      repo: repoName,
      tree: blobs,
      base_tree: commit.tree.sha,
    });
    
    // Create a new commit
    const commitMessage = `🚀 Full codebase commit - ${new Date().toLocaleString()}

Includes all source code, configuration, and documentation`;
    
    const { data: newCommit } = await octokit.git.createCommit({
      owner,
      repo: repoName,
      message: commitMessage,
      tree: newTree.sha,
      parents: [latestCommitSha],
    });
    
    console.log(`New commit created: ${newCommit.sha}`);
    
    // Update the reference
    await octokit.git.updateRef({
      owner,
      repo: repoName,
      ref: `heads/${repo.default_branch}`,
      sha: newCommit.sha,
    });
    
    console.log(`\n✅ Complete codebase committed successfully!`);
    console.log(`📦 Files committed: ${files.length}`);
    console.log(`🔗 View at: ${repo.html_url}`);
    
  } catch (error: any) {
    console.error('❌ Error committing to GitHub:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

commitToGitHub();
