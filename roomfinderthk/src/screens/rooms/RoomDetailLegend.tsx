export function RoomDetailLegend() {
    return (
        <div className="flex items-center gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                <span>In Use</span>
            </div>
            <div className="flex items-center gap-1">
                <span className="text-green-600">○○○</span>
                <span>Empty</span>
            </div>
            <div className="flex items-center gap-1">
                <span className="text-yellow-300">●○○</span>
                <span>Minimal</span>
            </div>
            <div className="flex items-center gap-1">
                <span className="text-yellow-600">●●○</span>
                <span>Moderate</span>
            </div>
            <div className="flex items-center gap-1">
                <span className="text-red-600">●●●</span>
                <span>Full</span>
            </div>
        </div>
    );
}
