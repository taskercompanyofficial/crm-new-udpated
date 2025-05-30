import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import React from 'react'
import AssignedToOpen from './assigned-to-open'

export default function Advanced() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Open Complaints</p>
                        <p className="text-sm text-muted-foreground">
                            Open all assigend to Technician Complaitns.
                        </p>
                    </div>
                    <AssignedToOpen />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-muted-foreground">
                            Toggle dark mode theme
                        </p>
                    </div>
                    <Switch />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Email Updates</p>
                        <p className="text-sm text-muted-foreground">
                            Receive email updates about your account
                        </p>
                    </div>
                    <Switch defaultChecked />
                </div>
            </CardContent>
        </Card>
    )
}
