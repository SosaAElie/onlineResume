function main(){
    window.addEventListener("scroll", e => {
        const currentY = window.scrollY;
        
        // The scroll height of the document is what the entire height 
        // of the body element is if it were taking up the entire screen height
        // The client height is the actual visible portion of the document body
        // The totalY is therefore the remainder that needs to be scrolled into/out of 
        const totalY = document.body.scrollHeight - document.body.clientHeight;

        const percentScrolled = (currentY/totalY)*100;
        const progressBar = document.getElementById("progress-bar");
        progressBar.style.width = `${percentScrolled}%`;
    })
}

main()