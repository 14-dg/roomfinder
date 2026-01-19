<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Check In to {roomName}</DialogTitle>
              <DialogDescription>
                Let others know you're using this room. Multiple students can check in simultaneously.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger id="duration" className="h-12">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30min">30 minutes</SelectItem>
                    <SelectItem value="1hour">1 hour</SelectItem>
                    <SelectItem value="2hours">2 hours</SelectItem>
                    <SelectItem value="3hours">3 hours</SelectItem>
                    <SelectItem value="4hours">4+ hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Activity */}
              <div className="space-y-2">
                <Label htmlFor="activity">Activity</Label>
                <Select value={activity} onValueChange={setActivity}>
                  <SelectTrigger id="activity" className="h-12">
                    <SelectValue placeholder="Select activity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quiet Study">📚 Quiet Study</SelectItem>
                    <SelectItem value="Reading">📖 Reading</SelectItem>
                    <SelectItem value="Exam Preparation">✏️ Exam Preparation</SelectItem>
                    <SelectItem value="Presentation Prep">🎤 Presentation Prep</SelectItem>
                    <SelectItem value="Project Work">💻 Project Work</SelectItem>
                    <SelectItem value="Online Meeting">💬 Online Meeting</SelectItem>
                    <SelectItem value="Group Discussion">👥 Group Discussion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full h-12"
                disabled={!selectedSlot || !activity}
              >
                Confirm Check In
              </Button>
            </div>
          </DialogContent>
        </Dialog>