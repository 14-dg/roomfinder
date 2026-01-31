export function AdminListElement<T>({contentType, elementId, elementText, onEdit, onDelete}: {contentType: string, elementId: string, elementText: string, onEdit: () => T, onDelete: () => T}) {
    return (
        <div className={contentType + "-list-element"}>
            <p>{elementId}</p>
            <p>{elementText}</p>
            <button onClick={onEdit}> edit </button>
            <button onClick={onDelete}> delete</button>
        </div>
    );
}