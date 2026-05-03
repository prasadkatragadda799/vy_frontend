import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace CSS part
css_start_marker = "/* === DIVINE CHAKRA SPLASH SCREEN === */"
css_end_marker = "/* === CRITICAL MOBILE FIX - INLINE TO BYPASS CACHE === */"

new_css = """/* === VIDEO SPLASH SCREEN === */
        #splash-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            overflow: hidden;
            transition: opacity 1.0s ease, visibility 1.0s ease;
        }

        #splash-screen.fade-out {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        }

        #splash-video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        /* Main Content Reveal */
        #main-content {
            opacity: 0;
            transition: opacity 1.0s ease;
        }

        #main-content.visible {
            opacity: 1;
        }

        """

html = html.replace(html[html.find(css_start_marker):html.find(css_end_marker)], new_css)

# Replace HTML part
html_start_marker = "<!-- DIVINE CHAKRA SPLASH SCREEN -->"
html_end_marker = "<!-- MAIN CONTENT -->"

new_html = """<!-- VIDEO SPLASH SCREEN -->
    <div id="splash-screen">
        <video id="splash-video" autoplay muted playsinline>
            <source src="final.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    </div>

    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const video = document.getElementById("splash-video");
            const splashScreen = document.getElementById("splash-screen");
            const mainContent = document.getElementById("main-content");
            let isRevealed = false;

            const revealContent = () => {
                if (isRevealed) return;
                isRevealed = true;
                splashScreen.classList.add("fade-out");
                mainContent.classList.add("visible");
                
                setTimeout(() => {
                    if (splashScreen.parentNode) {
                        splashScreen.parentNode.removeChild(splashScreen);
                    }
                }, 1000);
            };

            video.addEventListener("ended", revealContent);
            
            // Fallback for errors or if video is blocked
            video.addEventListener("error", revealContent);
            
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    revealContent();
                });
            }
        });
    </script>

    """

html = html.replace(html[html.find(html_start_marker):html.find(html_end_marker)], new_html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
