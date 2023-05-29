export default class List {
  constructor (name, title, filter, description, accentColor) {
    this.name = name
    this.title = title
    this.filter = filter
    this.description = description
    this.accentColor = accentColor

    this.orderBy = []
    this.filterBy = []
    this.icon = null
    this.wallpaper = null
  }
};
