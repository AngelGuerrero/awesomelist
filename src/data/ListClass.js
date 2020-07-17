/**
 * This list is not from Firebase
 * this list is for show the current
 * to do's
 */
export default class List {
  constructor (title, description, category) {
    this.name = title
    this.title = title
    this.description = description
    this.category = category
    this.orderBy = []
    this.filterBy = []
    this.icon = null
    this.wallpaper = null
    this.accentColor = null
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  setAccentColor (color) {
    this.accentColor = color
  }

  getAccentColor () {
    return this.accentColor || '#0078d7'
  }
};
