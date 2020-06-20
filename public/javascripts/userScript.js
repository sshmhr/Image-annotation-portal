{
    M.AutoInit();

    let rotateLeft = document.getElementById("rotateLeft");
    let rotateRight = document.getElementById("rotateRight");
    let rotateLeft1 = document.getElementById("rotateLeft1");
    let rotateRight1= document.getElementById("rotateRight1");
    let rotateCount = document.getElementById("rotateCount");
    let image = document.getElementById('image');

    let rotLeft =  ()=>{
        rotateCount.value = "" + ( Number(rotateCount.value) -90 );
        image.setAttribute('style',`transform:rotate(${rotateCount.value}deg)`);
    }


    let rotRight = ()=>{
            rotateCount.value = "" + ( Number(rotateCount.value)  + 90 );
            image.setAttribute('style',`transform:rotate(${rotateCount.value}deg)`);
    }
    if(rotateLeft!=null)
    rotateLeft.onclick =rotLeft;
    if(rotateLeft1!=null)
    rotateLeft1.onclick =rotLeft;
    if(rotateRight!=null)
    rotateRight.onclick = rotRight;
    if(rotateRight1!=null)
    rotateRight1.onclick = rotRight;
}