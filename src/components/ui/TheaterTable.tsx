import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";

interface Theater {
  id: number;
  name: string;
  location: string;
  capacity: number;
  screens: number;
}

interface TheaterTableProps {
  theaters: Theater[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const TheaterTable = ({ theaters, onEdit, onDelete }: TheaterTableProps) => {
  return (
    <Card className="p-4 overflow-x-auto">
      <table className="w-full border-collapse border border-border text-sm">
        <thead>
          <tr className="bg-muted text-left">
            <th className="p-3 border border-border">ID</th>
            <th className="p-3 border border-border">Name</th>
            <th className="p-3 border border-border">Location</th>
            <th className="p-3 border border-border">Capacity</th>
            <th className="p-3 border border-border">Screens</th>
            <th className="p-3 border border-border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {theaters.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="text-center py-4 text-muted-foreground"
              >
                No theaters available
              </td>
            </tr>
          ) : (
            theaters.map((theater) => (
              <tr key={theater.id} className="hover:bg-muted/50">
                <td className="p-3 border border-border">{theater.id}</td>
                <td className="p-3 border border-border font-medium">
                  {theater.name}
                </td>
                <td className="p-3 border border-border">{theater.location}</td>
                <td className="p-3 border border-border">{theater.capacity}</td>
                <td className="p-3 border border-border">{theater.screens}</td>
                <td className="p-3 border border-border">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit?.(theater.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete?.(theater.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Card>
  );
};

export default TheaterTable;
