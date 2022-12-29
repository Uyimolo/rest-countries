//toggle filter dropdown content
const filterToggle = document.querySelector(".filter-by-region");
filterToggle.addEventListener("click", (e) => {
  filterToggle.nextElementSibling.classList.toggle("active");
});
//remove active class from filterToggle when anything outside of it is clicked
document.addEventListener("click", (e) => {
  if (e.target !== filterToggle) {
    filterToggle.nextElementSibling.classList.remove("active");
  }
});
//fetch data template
const getData = (url, action) => {
  fetch(url)
    .then((res) => res.json())
    .then((data) => action(data))
    .catch((err) => error(err));
};

//show err

const error = (text) => {
  const errEle = document.createElement("p");
  errEle.classList.add("error");
  errEle.textContent = text;
  document.querySelector("body").appendChild(errEle);
  setTimeout(() => {
    document.querySelector("body").removeChild(errEle);
  }, 3000);
};
//show all countries
document.addEventListener("DOMContentLoaded", () => {
  const url = "https://restcountries.com/v3.1/all";
  getData(url, countries);
});

//display countries in home
const countries = (data) => {
  const countryContainer = document.querySelector(".countries");
  const countryContent = data
    .map(
      (country) => `
      <div class="country" id=${country.ccn3}>
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
  document
    .querySelectorAll(".flag-img")
    .forEach((flag) => flag.addEventListener("click", showCountryDetails));
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
    getData(url, countries);
  });
});

//search for country
const searchInput = document.querySelector(".search-input");
searchInput.addEventListener("change", () => {
  const url = `https://restcountries.com/v3.1/name/${searchInput.value}`;
  getData(url, countries);
});

// show country details
const showCountryDetails = (e) => {
  document.querySelector(".country-details").classList.add("show");
  document.querySelector(".countries").classList.add("hide");
  document.querySelector("body").classList.add("no-scroll);
  const countryName =
    e.target.parentElement.nextElementSibling.querySelector(
      ".name"
    ).textContent;
  const url = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;
  getData(url, countryDetails);
};

// show specific country detail
const countryDetails = (country) => {
  const data = country[0];

  const currencyArr = Object.values(data.currencies);
  let currencies = [];
  currencyArr.forEach((currency) => {
    currencies.push(currency.name);
  });

  const nativeName = Object.values(data.name.nativeName);
  let native = [];
  nativeName.forEach((nativeName) => {
    native.push(nativeName.official);
  });

  const countryContainer = document.querySelector(".country-details");
  countryContainer.innerHTML = `
  <div class="flag">
          <button class="back-btn"><i class="fa-solid fa-angle-left"></i>Back</button>
          <img src=${data.flags.png} alt="" />
        </div>
  <div class="full-details">
  <div class="container flex">
  <h2>${data.name.common}</h2>
  <div class="flex inner-container">
    <div class="first-half">
      <ul>
        <li>Native Name: <span>${native.join(", ")}</span></li>
        <li>Population: <span>${data.population}</span></li>
        <li>Region: <span>${data.region}</span></li>
        <li>Sub Region: <span>${data.subregion}</span></li>
        <li>Capital: <span>${data.capital}</span></li>
      </ul>
    </div>

    <div class="second-half">
      <ul>
        <li>Top Level Domain: <span>${data.tld}</span></li>
        <li>Currencies: <span>${currencies.join(", ")}</span></li>
        <li>Languages: <span>${Object.values(data.languages)}</span></li>
      </ul>
    </div>
  </div>
  </div>
  <div class="country-borders">
    <h3>Border Countries:</h3>
    <div class="border-countries  flex">
      <p> none </p>
    </div>
  </div>
</div>`;

  document.querySelector(".back-btn").addEventListener("click", back);

  // get border countries
  const borders = document.querySelector(".border-countries");
  borders.innerHTML = data.borders
    .map(
      (border) => `
    <button class="border-btn">${border}</button>
    `
    )
    .join("");

  isBorderless();

  document.querySelectorAll(".border-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      const countryCode = btn.textContent;
      borderDetails(countryCode);
    })
  );
};

// get border countries details
const borderDetails = (countryCode) => {
  url = `https://restcountries.com/v3.1/alpha/${countryCode}`;
  getData(url, countryDetails);
};

const isBorderless = () => {
  if (!document.querySelector(".border-btn")) {
    document.querySelector(".border-countries").innerHTML = "<p> none </p>";
  }
};

const back = () => {
  document.querySelector(".countries").classList.remove("hide");
  document.querySelector(".country-details").classList.remove("show");
  document.querySelector("body").classList.remove("no-scroll);
};
