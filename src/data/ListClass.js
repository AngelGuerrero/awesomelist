/**
 * This list is not from Firebase
 * this list is for show the current
 * to do's
 */
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
