import { useCampuses, useCreateCampus, useDeleteCampus, useUpdateCampus } from "@/hooks/campuses";
import type { Campus } from "@/types/models";
import { AdminListElement } from "@/components/AdminListElement";

export function AdminCampusListScreen() {

    const {data: campuses, isLoading, isError} = useCampuses();
    const createMutation = useCreateCampus();
    const updateMutation = useUpdateCampus();
    const deleteMutation = useDeleteCampus();

    const handleUpdate = () => {
        
    }

    const handleDelete = () => {
        deleteMutation.mutate();
    }

    return (
        <div>
            {campuses?.map((campus) => (
                <AdminListElement<Campus> contentType="campus" elementId={campus.id.toString()} elementText={campus.name} onEdit={handleUpdate} onDelete={handleDelete} />
            ))}
        </div>
    );
}