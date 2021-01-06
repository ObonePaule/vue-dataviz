export class Station {
  constructor(record) {
    this.haveCoords = true
    this.codeUIC = record.uic_code
    this.name = record.alias_libelle_noncontraint
    this.cityName = record.commune_libellemin
    this.deptName = record.departement_libellemin
    this.postalCode = record.adresse_cp
    this.popupContent = `
      ${this.name}
      <br/>
      ${this.cityName}, ${this.postalCode} ${this.deptName}
      <div>
        <a href='google.com'>ah oui</a>
        <a href='google.com'>ok</a>
      </div>
    `
    this.latlng = record.wgs_84

    if (!this.latlng) {
      this.haveCoords = false
    }
  }
}
