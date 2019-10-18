/*eslint no-undef: 0*/

const socket = io();


data.forEach((d, i) => {
  const img = document.createElement('img');
  img.src = d.url;
  document.querySelector("#grid").appendChild(img);
  img.addEventListener('click', () => {
    console.log({ imageID: i });
    socket.emit('image', { imageID: i });
    setTimeout(() => {
      location.href= `/details?id=${i}`
    }, 1000)
  });
});

/*
const slider = document.createElement('input');
slider.type = 'range';
slider.min = 0;
slider.value = 0;
slider.max = data[0].solaire.length - 1;
slider.step = 1;
document.body.appendChild(slider);

const year = document.createElement('p');
year.innerText = 2011;
document.body.appendChild(year);

slider.addEventListener('change', () => {
  year.innerText = 2011 + parseInt(slider.value);
  socket.emit('year', { year: parseInt(slider.value) });
}); */