interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
    someAction?: () => void;
    actionText?: string;
}

export default function ScreenHeader({ title, subtitle, someAction, actionText }: ScreenHeaderProps) {
    return (
        /* mt-12 schiebt den gesamten Header weiter nach unten */
        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-end mt-12 mb-8 px-4 sm:px-6 border-b border-border pb-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-base text-muted-foreground font-normal">
                        {subtitle}
                    </p>
                )}
            </div>
            
            {someAction && (
                <button
                    onClick={someAction}
                    className="mt-4 sm:mt-0 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    {actionText || "Action"}
                </button>
            )}
        </div>
    );
}