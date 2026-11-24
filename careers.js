const vacancySearch = document.querySelector("#vacancySearch");
const vacancyCards = [...document.querySelectorAll("[data-vacancy-search]")];
const vacancyResults = document.querySelector("#vacancyResults");
const vacancyEmpty = document.querySelector("#vacancyEmpty");

if (vacancySearch) {
  vacancySearch.addEventListener("input", () => {
    const terms = vacancySearch.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let visible = 0;

    for (const card of vacancyCards) {
      const searchableText = `${card.dataset.vacancySearch} ${card.textContent}`.toLowerCase();
      const matches = terms.every((term) => searchableText.includes(term));
      card.hidden = !matches;
      if (matches) visible += 1;
    }

    if (vacancyResults) {
      vacancyResults.textContent = terms.length
        ? `${visible} ${visible === 1 ? "vacancy" : "vacancies"} found`
        : `${visible} current ${visible === 1 ? "vacancy" : "vacancies"}`;
    }
    if (vacancyEmpty) vacancyEmpty.hidden = visible > 0;
  });
}
