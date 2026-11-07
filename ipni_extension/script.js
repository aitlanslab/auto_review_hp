const res = await fetch("https://ipni.org/n/77112075-1");
const html = await res.text();

const doc = new DOMParser().parseFromString(html, "text/html");

const getField = (label) => {
  const dt = [...doc.querySelectorAll("dt")]
    .find(el => el.textContent.includes(label));

  return dt?.nextElementSibling?.textContent.trim() || null;
};

const authors = [...doc.querySelectorAll(".author-link")]
  .map(el => el.textContent.trim());

const data = {
  family: getField("Family as entered in IPNI"),
  locality: getField("Locality"),
  distribution: getField("Distribution Of Types"),
  remarks: getField("Remarks"),
  lsid: getField("IPNI Life Sciences Identifier"),

  authors,
  firstAuthor: authors[0],
  authorCitation: authors.join(" ex ")
};

data