import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Calendar, Grid, List, Pencil, Trash2 } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Connection, InsertConnection } from "@shared/schema";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ConnectionsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingConnection, setEditingConnection] = useState<Connection | null>(null);
  const [formData, setFormData] = useState<InsertConnection>({
    name: "",
    relationship: "",
    lastTouch: null,
    notes: "",
  });

  const { toast } = useToast();

  const { data: connections = [], isLoading } = useQuery<Connection[]>({
    queryKey: ["/api/connections"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertConnection) => {
      const res = await apiRequest("POST", "/api/connections", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/connections"] });
      setIsCreateOpen(false);
      resetForm();
      toast({ title: "Connection created successfully" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertConnection> }) => {
      const res = await apiRequest("PATCH", `/api/connections/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/connections"] });
      setEditingConnection(null);
      resetForm();
      toast({ title: "Connection updated successfully" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/connections/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/connections"] });
      toast({ title: "Connection deleted successfully" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      relationship: "",
      lastTouch: null,
      notes: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingConnection) {
      updateMutation.mutate({ id: editingConnection.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openEdit = (connection: Connection) => {
    setEditingConnection(connection);
    setFormData({
      name: connection.name,
      relationship: connection.relationship,
      lastTouch: connection.lastTouch,
      notes: connection.notes || "",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getDaysSinceLastTouch = (lastTouch: string | null) => {
    if (!lastTouch) return null;
    return differenceInDays(new Date(), parseISO(lastTouch));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-light tracking-tight mb-2" data-testid="text-connections-title">
            Connections
          </h1>
          <p className="text-muted-foreground">Manage your professional relationships</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              data-testid="button-view-grid"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              data-testid="button-view-list"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-connection">
                <Plus className="h-4 w-4 mr-2" />
                Add Connection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Connection</DialogTitle>
                <DialogDescription>Create a new professional connection to track</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    data-testid="input-connection-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship *</Label>
                  <Input
                    id="relationship"
                    data-testid="input-connection-relationship"
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    placeholder="e.g., Mentor, Colleague, Client"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastTouch">Last Contact</Label>
                  <Input
                    id="lastTouch"
                    data-testid="input-connection-last-touch"
                    type="date"
                    value={formData.lastTouch || ""}
                    onChange={(e) => setFormData({ ...formData, lastTouch: e.target.value || null })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    data-testid="input-connection-notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Add any relevant notes..."
                    rows={3}
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    data-testid="button-submit-connection"
                  >
                    Create Connection
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingConnection} onOpenChange={(open) => !open && setEditingConnection(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Connection</DialogTitle>
            <DialogDescription>Update connection details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                data-testid="input-edit-connection-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-relationship">Relationship *</Label>
              <Input
                id="edit-relationship"
                data-testid="input-edit-connection-relationship"
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lastTouch">Last Contact</Label>
              <Input
                id="edit-lastTouch"
                data-testid="input-edit-connection-last-touch"
                type="date"
                value={formData.lastTouch || ""}
                onChange={(e) => setFormData({ ...formData, lastTouch: e.target.value || null })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                data-testid="input-edit-connection-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                data-testid="button-update-connection"
              >
                Update Connection
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Connections List/Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading connections...</div>
      ) : connections.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No connections yet</h3>
            <p className="text-muted-foreground mb-4">Start building your professional network</p>
            <Button onClick={() => setIsCreateOpen(true)} data-testid="button-create-first-connection">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Connection
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connections.map((connection) => {
            const daysSince = getDaysSinceLastTouch(connection.lastTouch);
            const needsAttention = daysSince === null || daysSince > 30;

            return (
              <Card key={connection.id} className="hover-elevate" data-testid={`connection-card-${connection.id}`}>
                <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{getInitials(connection.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">{connection.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{connection.relationship}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(connection)}
                      data-testid={`button-edit-connection-${connection.id}`}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(connection.id)}
                      data-testid={`button-delete-connection-${connection.id}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {connection.lastTouch ? format(parseISO(connection.lastTouch), "MMM d, yyyy") : "No contact yet"}
                    </div>
                    {needsAttention && (
                      <Badge variant="outline" className="text-xs">
                        {daysSince ? `${daysSince}d ago` : "Never"}
                      </Badge>
                    )}
                  </div>
                  {connection.notes && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{connection.notes}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {connections.map((connection) => {
                const daysSince = getDaysSinceLastTouch(connection.lastTouch);
                const needsAttention = daysSince === null || daysSince > 30;

                return (
                  <div
                    key={connection.id}
                    className="flex items-center justify-between gap-4 p-4 hover-elevate"
                    data-testid={`connection-row-${connection.id}`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{getInitials(connection.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{connection.name}</p>
                        <p className="text-sm text-muted-foreground">{connection.relationship}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-mono text-muted-foreground">
                          {connection.lastTouch ? format(parseISO(connection.lastTouch), "MMM d, yyyy") : "No contact"}
                        </p>
                        {needsAttention && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {daysSince ? `${daysSince}d ago` : "Never"}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(connection)}
                          data-testid={`button-edit-connection-list-${connection.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMutation.mutate(connection.id)}
                          data-testid={`button-delete-connection-list-${connection.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
