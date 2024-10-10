  //edit
    const anehPlayer = videojs('aneh-player'); 

    // Function to load the last watched episode from localStorage
    function loadLastWatched() {
        const lastWatched = localStorage.getItem('lastWatchedEpisode');
        if (lastWatched) {
            changeVideo(lastWatched, null); // Load the video without playing
        }
    }

    // Function to change the video and update the button state
    function changeVideo(url, button) {
        anehPlayer.src({ type: 'video/mp4', src: url }); // Set the new video source

        // Save the last watched episode in localStorage
        localStorage.setItem('lastWatchedEpisode', url);

        // Change button color and disable it
        const buttons = document.querySelectorAll('.aneh-button');
        buttons.forEach(btn => {
            btn.classList.remove('active'); // Remove active class from all buttons
            btn.disabled = false; // Enable all buttons
        });

        if (button) {
            button.classList.add('active'); // Add active class to the clicked button
            button.disabled = true; // Disable the clicked button
        }
    }

    // Fetch the JSON URL from the <script> tag
    const jsonUrlElement = document.getElementById('json-url');
    const jsonUrl = jsonUrlElement.getAttribute('data-json-url');

    console.log("JSON URL: ", jsonUrl); // Log the JSON URL to confirm it's correct

    // Fetch JSON data and create buttons dynamically
    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(videoData => {
            console.log("Video data fetched: ", videoData); // Log the fetched video data to debug

            const buttonContainer = document.getElementById('button-container');
            
            // Ensure the button container exists
            if (!buttonContainer) {
                console.error('Button container element not found!');
                return;
            }

            videoData.episodes.forEach(episode => {
                const button = document.createElement('button');
                button.className = 'aneh-button';
                button.innerText = episode.title;
                button.onclick = function() {
                    changeVideo(episode.url, button);
                };
                buttonContainer.appendChild(button);
            });

            // Log the buttons that are created
            console.log("Buttons created: ", document.querySelectorAll('.aneh-button'));

            // Load the last watched episode when the page is loaded
            loadLastWatched();

            // Highlight the active button
            const lastWatched = localStorage.getItem('lastWatchedEpisode');
            if (lastWatched) {
                const buttons = document.querySelectorAll('.aneh-button');
                buttons.forEach(btn => {
                    // Check if the button title and the URL match the last watched episode
                    if (videoData.episodes.some(episode => episode.url === lastWatched && btn.innerText === episode.title)) {
                        btn.classList.add('active');
                        btn.disabled = true; // Disable the button
                    }
                });
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
