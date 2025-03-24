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
        const stepCircle = stepCircles[i];
        const currentPercent = distance/progressBarContainerWidth
        const lastPercent = i === 0?0:distancesAsPercentages[i-1];
        const totalPercent = currentPercent + lastPercent;
        distancesAsPercentages.push(totalPercent);
        distances.push(distance);
        content.percentOfProgressbar = currentPercent;
        stepCircle.percentOfProgressbar = currentPercent;
        content.totalPercentOfProgressbar = totalPercent;
        stepCircle.totalPercentOfProgressbar = totalPercent;
        content.style.scrollMarginTop = `${header.clientHeight*0.99}px`;
    }

    window.addEventListener("scroll", e => {

        //Check to see if the entire page has been scrolled down to the end
        //If so fill the last step circle in and complete the progress bar 
        const currentY = window.scrollY;
        const totalY = document.body.scrollHeight - document.body.clientHeight;

        if (currentY === totalY){
            stepCircles.forEach( stepCircle => {
            requestAnimationFrame(()=>{
                if(!stepCircle.classList.contains("filled"))stepCircle.classList.add("filled");
                progressBar.style.width = "100%";
                })
            })
            progressBar.currentPercent = 100;
            return;
        }
        else if(currentY <= 0){
            stepCircles.forEach( stepCircle => {
                requestAnimationFrame(()=>{
                    if(stepCircle.classList.contains("filled"))stepCircle.classList.remove("filled");
                    progressBar.style.width = "0%";
                })
            })
        }
        
        const headerHeight = header.clientHeight;
        
        contents.forEach((content, i) =>  {
            const topBorderPosition = content.getBoundingClientRect().y;
            const contentHeight = content.clientHeight;
            const bottomBorderPosition = topBorderPosition + contentHeight;
            
            
            //If the content hasn't reached the bottom border of the header then don't calculate anything for it yet
            //Or if the content bottom is past the bottom border of the header then ignore it
            if (topBorderPosition > headerHeight){
                requestAnimationFrame(()=>{
                    if(stepCircles[i].classList.contains("filled"))stepCircles[i].classList.remove("filled");
                })
                return;
            }
            else if(topBorderPosition <= headerHeight){
                requestAnimationFrame(()=>{
                    if(!stepCircles[i].classList.contains("filled"))stepCircles[i].classList.add("filled");
                })                    
            }
            
            if(bottomBorderPosition < headerHeight) return;

            //Determine the percent of the content that has been scrolled past
            const contentPercentScrolled = 100 - (((bottomBorderPosition-headerHeight)/contentHeight) * 100);
            const portionOfPercentBarForThisContent = contentPercentScrolled * content.percentOfProgressbar;
            
            if(i > 0){
                const previousTotalContentPercentage = contents[i-1].totalPercentOfProgressbar;
                const progressBarFill = portionOfPercentBarForThisContent + (previousTotalContentPercentage*100);
                requestAnimationFrame(()=>{
                    progressBar.style.width = `${progressBarFill}%`;
                })
                progressBar.currentPercent = progressBarFill;
            }
            else{
                const progressBarFill = portionOfPercentBarForThisContent;
                requestAnimationFrame(()=>{
                    progressBar.style.width = `${progressBarFill}%`;
                })
                progressBar.currentPercent = progressBarFill;
            }
        })
        
    })
}

main()