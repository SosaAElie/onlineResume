function main(){
    const header = document.getElementById("header");
    const progressBar = document.getElementById("progress-bar");
    const progressBarContainer = document.getElementById("progress-container");
    const contents = document.querySelectorAll(".content");
    const stepCircles = document.querySelectorAll(".step-circle");
    const progressBarContainerWidth = progressBarContainer.clientWidth;
    //Determine the distance between each step circle, from left border to left border
    const distancesAsPercentages = [];
    const distances = [];
    for(let i = 0; i < stepCircles.length-1; i++){
        const currentCircleLeftBorder = stepCircles[i].getBoundingClientRect().left;
        const nextCircleLeftBorder = stepCircles[i+1].getBoundingClientRect().left;
        const distance = nextCircleLeftBorder - currentCircleLeftBorder;
        const content = contents[i];
        const currentPercent = distance/progressBarContainerWidth
        const lastPercent = i === 0?0:distancesAsPercentages[i-1];
        const totalPercent = currentPercent + lastPercent;
        distancesAsPercentages.push(totalPercent);
        distances.push(distance);
        content.percentOfProgressbar = currentPercent;
        stepCircles[i].percentOfProgressbar = currentPercent;
        content.totalPercentOfProgressbar = totalPercent;
        stepCircles[i].totalPercentOfProgressbar = totalPercent;
    }
    window.addEventListener("scroll", e => {
        const currentY = window.scrollY;
        
        // The scroll height of the document is what the entire height 
        // of the body element is if it were taking up the entire screen height
        // The client height is the actual visible portion of the document body
        // The totalY is therefore the remainder that needs to be scrolled into/out of 
        // const totalY = document.body.scrollHeight - document.body.clientHeight;

        // const percentScrolled = (currentY/totalY)*100;
        const headerHeight = header.clientHeight;
        
        contents.forEach((content, i) =>  {
            const topBorderPosition = content.getBoundingClientRect().y;
            const contentHeight = content.clientHeight;
            const bottomBorderPosition = topBorderPosition + contentHeight;
            
            //If the content hasn't reached the bottom border of the header then don't calculate anything for it yet
            //Or if the content bottom is past the bottom border of the header then ignore it
            if (topBorderPosition > headerHeight){
                if(stepCircles[i].classList.contains("filled"))stepCircles[i].classList.remove("filled");
                return;
            }
            else if(topBorderPosition <= headerHeight){
                if(!stepCircles[i].classList.contains("filled"))stepCircles[i].classList.add("filled");
            }
            if(bottomBorderPosition <= headerHeight) return;
            
            //Determine the percent of the content that has been scrolled past
            const contentPercentScrolled = 100 - (((bottomBorderPosition-headerHeight)/contentHeight) * 100);
            const portionOfPercentBarForThisContent = contentPercentScrolled * content.percentOfProgressbar;
            
            if(i > 0){
                const previousTotalContentPercentage = contents[i-1].totalPercentOfProgressbar;
                const progressBarFill = portionOfPercentBarForThisContent + (previousTotalContentPercentage*100);
                progressBar.style.width = `${progressBarFill}%`;
                progressBar.currentPercent = progressBarFill;
            }
            else{
                const progressBarFill = portionOfPercentBarForThisContent;
                progressBar.style.width = `${progressBarFill}%`;
                progressBar.currentPercent = progressBarFill;
            }
            
        })

    })
}

main()