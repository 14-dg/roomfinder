
interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
    someAction?: () => void;
    actionText?: string;
}

export default function ScreenHeader({ title, subtitle, someAction, actionText }: ScreenHeaderProps) {
    return (
        <div className="screen-header">
            <h1>{title}</h1>
            {subtitle && <h2>{subtitle}</h2>}
            {someAction && <button onClick={someAction}>{actionText || "Action"}</button>}
        </div>
    );
}