const filterToggle = document.querySelector(".filter-by-region");
filterToggle.addEventListener("click", () => {
  filterToggle.nextElementSibling.classList.toggle("active");
});

//show all countries
document.addEventListener("DOMContentLoaded", () => {
  fetch("https://restcountries.com/v3.1/all")
    .then((res) => res.json())
    .then((data) => countries(data));
});

//display countries in home
const countries = (data) => {
  const countryContainer = document.querySelector(".countries");
  const countryContent = data
    .map(
      (country) => `<div class="country" id=${country.car.cca2}>
  <div class="flag">
    <img src=${country.flags.png} alt="" class="flag-img"/>
  </div>
  <div class="details flex">
    <h3 class="name">${country.name.common}</h3>
    <p class="population"><span>Population:</span> ${country.population}</p>
    <p class="region"><span> Region:</span>${country.region}</p>
    <p class="capital"><span> Capital:</span> ${country.capital}</p>
  </div>
</div>`
    )
    .join("");
  countryContainer.innerHTML = countryContent;
};
//filter countries by region
const filter = document.querySelectorAll(".region");
filter.forEach((filterBtn) => {
  filterBtn.addEventListener("click", () => {
    const region = filterBtn.id;
    let url = `https://restcountries.com/v3.1/region/${region}`;
    if (filterBtn.id === "all") {
      url = "https://restcountries.com/v3.1/all";
    }
    fetch(url)
      .then((res) => res.json())
      .then((data) => countries(data));
  });
});

//search for country
const searchInput = document.querySelector(".search-input");
searchInput.addEventListener("change", () => {
  const url = `https://restcountries.com/v3.1/name/${searchInput.value}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => countries(data));
});
