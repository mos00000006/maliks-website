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


const cvDialog = document.querySelector("#cvUploadDialog");
const cvApplicationForm = document.querySelector("#cvApplicationForm");
const cvFormStatus = document.querySelector("#cvFormStatus");
const cvSource = document.querySelector("#cvSource");
const cvOtherSourceField = document.querySelector("#cvOtherSourceField");
const cvOtherSource = document.querySelector("#cvOtherSource");
const cvFile = document.querySelector("#cvFile");
const cvFileName = document.querySelector("#cvFileName");

for (const button of document.querySelectorAll("[data-open-cv]")) {
  button.addEventListener("click", () => {
    if (cvDialog?.showModal) cvDialog.showModal();
  });
}
for (const button of document.querySelectorAll("[data-close-cv]")) {
  button.addEventListener("click", () => cvDialog?.close());
}
cvDialog?.addEventListener("click", (event) => {
  if (event.target === cvDialog) cvDialog.close();
});

cvSource?.addEventListener("change", () => {
  const showOther = cvSource.value === "Other";
  if (cvOtherSourceField) cvOtherSourceField.hidden = !showOther;
  if (cvOtherSource) {
    cvOtherSource.required = showOther;
    if (!showOther) cvOtherSource.value = "";
  }
});

cvFile?.addEventListener("change", () => {
  if (cvFileName) cvFileName.textContent = cvFile.files?.[0]?.name || "PDF, DOC or DOCX";
});

cvApplicationForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!cvApplicationForm.reportValidity()) return;
  if (cvFormStatus) {
    cvFormStatus.textContent = "Online applications are not active yet. Your information has not been sent or saved. Please contact Maliks to apply.";
  }
});
