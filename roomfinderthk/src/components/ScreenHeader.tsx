/**
 * Props for the ScreenHeader component
 */
interface ScreenHeaderProps {
    /** Main heading text displayed at the top of the screen */
    title: string;
    /** Optional subtitle displayed below the main title */
    subtitle?: string;
    /** Optional callback function triggered when action button is clicked */
    someAction?: () => void;
    /** Text displayed on the action button (if someAction is provided) */
    actionText?: string;
}

/**
 * ScreenHeader component that displays a consistent page header
 * with title, optional subtitle, and optional action button.
 * Used across all main screens in the application.
 * 
 * @param props - ScreenHeaderProps containing title and optional subtitle/action
 * @returns Header component with Tailwind styling and responsive layout
 */
export default function ScreenHeader({ title, subtitle, someAction, actionText }: ScreenHeaderProps) {
    return (
        /* mt-12 adds top margin to push content below the fixed header */
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