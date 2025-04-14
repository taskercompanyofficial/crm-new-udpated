"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useGoogleLogin } from '@react-oauth/google';

// This will be the single email account where all contacts are saved
const ADMIN_EMAIL = "admin@example.com"; // Replace with your desired email
const GOOGLE_CLIENT_ID = "333114966119-p58epscu427btagfugqtkfv8q3tq1an4.apps.googleusercontent.com";

export default function ContactsPage() {
    const [contact, setContact] = useState({
        name: "",
        email: "",
        phone: "",
        notes: ""
    });

    const [status, setStatus] = useState({
        loading: false,
        error: null as string | null,
        success: false
    });

    const [accessToken, setAccessToken] = useState<string | null>(null);

    const login = useGoogleLogin({
        onSuccess: async (response) => {
            setAccessToken(response.access_token);
        },
        scope: 'https://www.googleapis.com/auth/contacts',
        onError: (error: any) => {
            setStatus({
                loading: false,
                error: "Failed to authenticate with Google",
                success: false
            });
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!accessToken) {
            login();
            return;
        }

        setStatus({ loading: true, error: null, success: false });

        try {
            // Input validation
            if (!contact.name.trim()) {
                throw new Error("Name is required");
            }

            // Configure axios with OAuth access token
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            };

            // Format notes to include submitted contact info
            const formattedNotes = `
Contact Information:
Email: ${contact.email || 'Not provided'}
Phone: ${contact.phone || 'Not provided'}
Additional Notes: ${contact.notes || 'None'}
      `.trim();

            // Make API call to Google People API
            const response = await axios.post(
                'https://people.googleapis.com/v1/people:createContact',
                {
                    names: [{
                        givenName: contact.name
                    }],
                    emailAddresses: [{
                        value: ADMIN_EMAIL // Using the single admin email
                    }],
                    biographies: [{
                        value: formattedNotes
                    }]
                },
                config
            );

            if (response.status === 200) {
                setStatus({ loading: false, error: null, success: true });
                setContact({ name: "", email: "", phone: "", notes: "" });
                setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 3000);
            }

        } catch (error) {
            console.error('Error saving contact to Google:', error);
            setStatus({
                loading: false,
                error: error instanceof Error ? error.message : "Failed to save contact. Please try again.",
                success: false
            });
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Contact</CardTitle>
                </CardHeader>
                <CardContent>
                    {status.error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            {status.error}
                        </div>
                    )}

                    {status.success && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                            Contact saved successfully to Google Contacts!
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={contact.name}
                                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                                required
                                disabled={status.loading}
                                placeholder="Enter contact name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={contact.email}
                                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                                disabled={status.loading}
                                placeholder="Enter email address"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={contact.phone}
                                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                                disabled={status.loading}
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Input
                                id="notes"
                                value={contact.notes}
                                onChange={(e) => setContact({ ...contact, notes: e.target.value })}
                                disabled={status.loading}
                                placeholder="Add any additional notes"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={status.loading}
                        >
                            {!accessToken ? "Sign in with Google" : status.loading ? "Saving..." : "Save Contact"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}