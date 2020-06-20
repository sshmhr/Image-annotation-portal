{
    M.AutoInit();

    let rotateLeft = document.getElementById("rotateLeft");
    let rotateRight = document.getElementById("rotateRight");
    let rotateCount = document.getElementById("rotateCount");
    let image = document.getElementById('image');

    rotateLeft.onclick = ()=>{
        rotateCount.value = "" + ( Number(rotateCount.value) -90 );
        image.setAttribute('style',`transform:rotate(${rotateCount.value}deg)`);
    }

    rotateRight.onclick = ()=>{
        rotateCount.value = "" + ( Number(rotateCount.value)  + 90 );
        image.setAttribute('style',`transform:rotate(${rotateCount.value}deg)`);
    }
}