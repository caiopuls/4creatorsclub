useEffect(() => {
    if (isAnalyzing) {
        let currentProgress = 0;

        const simulateProgress = () => {
            if (currentProgress >= 100) {
                setTimeout(() => {
                    window.location.href = "https://pay.kiwify.com.br/OEyEGxp";
                }, 1000);
                return;
            }

            // Random increment between 1 and 3
            const increment = Math.random() * 2 + 1;
            currentProgress = Math.min(currentProgress + increment, 100);
            setAnalysisProgress(currentProgress);

            // Random delay: mostly fast, sometimes slow
            let delay = Math.random() * 100 + 50; // Normal: 50-150ms

            // 10% chance of a "thinking" pause
            if (Math.random() < 0.1) {
                delay = Math.random() * 1000 + 500; // Pause: 500-1500ms
            }

            setTimeout(simulateProgress, delay);
        };

        simulateProgress();

        // Change text steps based on progress thresholds instead of time
        const updateSteps = () => {
            if (currentProgress < 20) setAnalysisStep(0);
            else if (currentProgress < 45) setAnalysisStep(1);
            else if (currentProgress < 75) setAnalysisStep(2);
            else if (currentProgress < 95) setAnalysisStep(3);
            else setAnalysisStep(4);

            if (currentProgress < 100) requestAnimationFrame(updateSteps);
        };
        updateSteps();

    }
}, [isAnalyzing]);
