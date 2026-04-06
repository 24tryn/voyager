/**
 * Trip Export & Sharing Manager
 * Handles exporting trips as PDF, JSON, and iCalendar formats
 */

const TripExporter = {
    /**
     * Export trip as JSON
     */
    exportAsJSON(trip) {
        const data = {
            id: trip.id || 'trip_' + Date.now(),
            name: trip.name || 'My Trip',
            createdAt: new Date().toISOString(),
            attractions: trip.attractions || [],
            routes: trip.routes || [],
            startLocation: trip.startLocation || {},
            endDate: trip.endDate || new Date().toISOString(),
            totalDistance: trip.totalDistance || 0,
            totalCost: trip.totalCost || 0,
            notes: trip.notes || ''
        };

        const jsonString = JSON.stringify(data, null, 2);
        this.downloadFile(jsonString, `${data.name}_${Date.now()}.json`, 'application/json');
        
        return data;
    },

    /**
     * Export trip as PDF
     * Note: Using a simple HTML-to-PDF approach or external library
     */
    async exportAsPDF(trip) {
        try {
            // Check if html2pdf library is loaded
            if (typeof html2pdf === 'undefined') {
                this.loadHtml2PdfLibrary();
            }

            const element = this.generatePDFContent(trip);
            const options = {
                margin: 10,
                filename: `${trip.name || 'Trip'}_${Date.now()}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
            };

            html2pdf().set(options).from(element).save();
            return true;
        } catch (error) {
            console.warn('PDF export requires html2pdf library. Falling back to JSON export.');
            this.exportAsJSON(trip);
            return false;
        }
    },

    /**
     * Generate HTML content for PDF
     */
    generatePDFContent(trip) {
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1>${trip.name || 'Trip Plan'}</h1>
                <p><strong>Created:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Duration:</strong> ${trip.duration || 'N/A'}</p>
                
                <h2>Trip Summary</h2>
                <ul>
                    <li>Total Attractions: ${trip.attractions?.length || 0}</li>
                    <li>Total Distance: ${trip.totalDistance || 0} miles</li>
                    <li>Estimated Cost: $${trip.totalCost || 0}</li>
                </ul>

                ${trip.attractions?.length > 0 ? `
                    <h2>Attractions</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #f2f2f2;">
                                <th style="border: 1px solid #ddd; padding: 8px;">Name</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">Location</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">Rating</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">Distance</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${trip.attractions.map(attr => `
                                <tr>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${attr.name}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${attr.location}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${attr.rating || 'N/A'}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${attr.distance || 'N/A'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : ''}

                ${trip.notes ? `
                    <h2>Notes</h2>
                    <p>${trip.notes}</p>
                ` : ''}
            </div>
        `;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        return wrapper;
    },

    /**
     * Export trip as iCalendar (.ics) format
     */
    exportAsICalendar(trip) {
        let ics = 'BEGIN:VCALENDAR\n';
        ics += 'VERSION:2.0\n';
        ics += 'PRODID:-//Voyager Travel App//EN\n';
        ics += `CALSCALE:GREGORIAN\n`;
        ics += `METHOD:PUBLISH\n`;
        ics += `X-WR-CALNAME:${this.escapeICSText(trip.name || 'Trip')}\n`;
        ics += `X-WR-TIMEZONE:UTC\n`;

        // Add events for each attraction
        const attractions = trip.attractions || [];
        attractions.forEach((attr, index) => {
            const startDate = new Date(trip.startDate || Date.now());
            startDate.setDate(startDate.getDate() + index);

            ics += this.generateICSEvent({
                uid: `${attr.id}-${trip.id}@voyager.app`,
                summary: attr.name,
                description: attr.description || `Visit ${attr.name} at ${attr.location}`,
                location: attr.location,
                startDate: startDate,
                duration: 120, // 2 hours default
                url: attr.url || ''
            });
        });

        ics += 'END:VCALENDAR';

        this.downloadFile(ics, `${trip.name || 'Trip'}_${Date.now()}.ics`, 'text/calendar');
        return ics;
    },

    /**
     * Generate individual ICS event
     */
    generateICSEvent(event) {
        const formatDateTime = (date) => {
            return date.toISOString()
                .replace(/[-:]/g, '')
                .replace(/\.\d{3}/, '');
        };

        const endDate = new Date(event.startDate);
        endDate.setMinutes(endDate.getMinutes() + event.duration);

        let ics = 'BEGIN:VEVENT\n';
        ics += `UID:${event.uid}\n`;
        ics += `DTSTAMP:${formatDateTime(new Date())}\n`;
        ics += `DTSTART:${formatDateTime(event.startDate)}\n`;
        ics += `DTEND:${formatDateTime(endDate)}\n`;
        ics += `SUMMARY:${this.escapeICSText(event.summary)}\n`;
        ics += `DESCRIPTION:${this.escapeICSText(event.description)}\n`;
        ics += `LOCATION:${this.escapeICSText(event.location)}\n`;
        if (event.url) ics += `URL:${event.url}\n`;
        ics += 'END:VEVENT\n';

        return ics;
    },

    /**
     * Escape special characters for ICS format
     */
    escapeICSText(text) {
        return text
            .replace(/\\/g, '\\\\')
            .replace(/,/g, '\\,')
            .replace(/;/g, '\\;')
            .replace(/\n/g, '\\n');
    },

    /**
     * Generate shareable trip link
     */
    generateShareLink(trip) {
        const encoded = btoa(JSON.stringify(trip));
        const shareUrl = `${window.location.origin}?trip=${encoded}`;
        return shareUrl;
    },

    /**
     * Load and share to social media
     */
    shareToSocial(trip, platform = 'twitter') {
        const message = `Check out my trip to ${trip.name}! I'm planning to visit ${trip.attractions?.length || 0} amazing attractions.`;
        const url = this.generateShareLink(trip);

        const socialUrls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`,
            email: `mailto:?subject=${encodeURIComponent(trip.name + ' Trip Plan')}&body=${encodeURIComponent(message + '\n\n' + url)}`
        };

        if (socialUrls[platform]) {
            window.open(socialUrls[platform], '_blank', 'width=600,height=400');
        }
    },

    /**
     * Copy shareable link to clipboard
     */
    copyShareLink(trip) {
        const link = this.generateShareLink(trip);
        navigator.clipboard.writeText(link).then(() => {
            alert('Trip link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    },

    /**
     * Download helper
     */
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * Load html2pdf library dynamically
     */
    loadHtml2PdfLibrary() {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        document.head.appendChild(script);
    }
};

// Export for use
window.TripExporter = TripExporter;
