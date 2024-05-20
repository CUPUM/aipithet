'use client';

import { Button } from '@lib/components/primitives/button';
import { useCallback, useState } from 'react';

export function DownloadButton(props: { surveyId: string }) {
	const [loading, setLoading] = useState(false);
	const handleDownload = useCallback(async () => {
		setLoading(true);
		try {
			const response = await fetch(`/api/download-survey-data/${props.surveyId}`);
			if (!response.ok) {
				throw new Error('Failed to download data');
			}
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'data.zip';
			document.body.appendChild(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error downloading data:', error);
		} finally {
			setLoading(false);
		}
	}, [props.surveyId]);

	return (
		<Button onClick={handleDownload} disabled={loading}>
			{loading ? 'Downloading...' : 'Download Data'}
		</Button>
	);
}
