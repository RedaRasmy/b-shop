import { useState } from "react"

export function useDialogs() {
    const [addingNew, setAddingNew] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    return {
        // State
        addingNew,
        editingId,
        deletingId,

        // Derived booleans
        isAddOpen: addingNew,
        isEditOpen: editingId !== null,
        isDeleteOpen: deletingId !== null,

        // Actions
        openAdd: () => setAddingNew(true),
        closeAdd: () => setAddingNew(false),

        openEdit: (id: string) => setEditingId(id),
        closeEdit: () => setEditingId(null),

        openDelete: (id: string) => setDeletingId(id),
        closeDelete: () => setDeletingId(null),

        // setters:
        setAddingNew,
        setEditingId,
        setDeletingId,
    }
}
