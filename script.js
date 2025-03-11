// once the DOM content is loaded, then perform logic inside the function
document.addEventListener('DOMContentLoaded', () => {

    const usernameInput = document.getElementById('user-input');
    const searchBtn = document.getElementById('search');
    const statsContainer = document.querySelector('.stats-container');
    const easyProgress = document.querySelector('.easy-progress');
    const mediumProgress = document.querySelector('.medium-progress');
    const hardProgress = document.querySelector('.hard-progress');
    const easyLabel = document.getElementById('easy-label');
    const mediumLabel = document.getElementById('medium-label');
    const hardLabel = document.getElementById('hard-label');
    const statsCards = document.querySelector('.stats-cards');

    statsContainer.classList.add("display");

    // Return true or false based on regex
    const handleValidation = (username) => {
        if (username.trim() === "") {
            // alert('Username should not be empty');
            document.getElementById('empty').innerHTML = 'Username should not be empty';
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            // alert('Invalid username');
            document.getElementById('empty').innerHTML = "Invalid Username"
        }
        return isMatching;
    }

    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {

            searchBtn.textContent = "searching...";
            searchBtn.disabled = true;
            statsContainer.classList.add("display");


            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('unable to ftech the user details');
            }
            const data = await response.json();
            // console.log('logging data: ', data);

            displayUserData(data);
        }
        catch (error) {
            // console.log(error);
            statsContainer.innerHTML = `${error}`
        }
        finally {
            searchBtn.textContent = "search";
            searchBtn.disabled = false;
            statsContainer.classList.remove("display");
            document.getElementById('empty').innerHTML = '';
        }
    }

    // Updating the Progress
    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    // Accessing the API properties and there values to display in UI
    function displayUserData(data) {
        const totalEasyQues = data.totalEasy;
        const totalMediumdQues = data.totalMedium;
        const totalHardQues = data.totalHard;

        const solvedEasyQues = data.easySolved;
        const solvedMediumQues = data.mediumSolved;
        const solvedHardQues = data.hardSolved;

        updateProgress(solvedEasyQues, totalEasyQues, easyLabel, easyProgress);
        updateProgress(solvedMediumQues, totalMediumdQues, mediumLabel, mediumProgress);
        updateProgress(solvedHardQues, totalHardQues, hardLabel, hardProgress);

        const cardData = [
            { label: "Acceptance Rate", value: data.acceptanceRate },
            { label: "Ranking", value: data.ranking },
            { label: "Contribution Points", value: data.contributionPoints },
        ];
        // console.log("card data: ", cardData);

        // Displaying the cards
        statsCards.innerHTML = cardData.map((card) => {
            return `
               <div class='card'>
               <h3>${card.label} : <span>${card.value}</span></h3>
               </div>
               `
        }).join("");

    }
    // Accessing the input value on search button click
    searchBtn.addEventListener('click', () => {
        const username = usernameInput.value;
        // console.log(`Login username ${username}`);
        if (handleValidation(username)) {
            fetchUserDetails(username);
        }
    })

})