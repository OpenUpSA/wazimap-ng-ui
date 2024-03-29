
export const slugify = (string) => {
    return string.replace(/^\s+|\s+$/g, '').replace(/[^a-z0-9]/g, '').replace(/\s+/g, '_').replace(/_+/g, '_');
}
/**
 * createFiltersForGroups
 * this method creates the filter for the data transformations as well as the signals that drive the filter. we can set signals from outside to set the filter. we use two signals, one to indicate if the filter is active (we can have multiple filters) the second is the value we filter for. 
 *
**/
export const createFiltersForGroups = (groups) => {
  // we use a Map here to make it faster to create unique filters
  let filters = new Map();
  let signals = new Map();
  groups.forEach((group) => {
    let { name } = group;
    let keyName = slugify(name)
    filters.set(keyName, {
      type: "filter",
      expr: `!${keyName}Filter || (${keyName}Filter && indexof(${keyName}FilterValue, datum["${name}"]) >= 0)`
    })
    signals.set(keyName, { name: `${keyName}Filter`, value: false })
    signals.set(`${keyName}Value`, { name: `${keyName}FilterValue`})
  })
  return {
    signals: Array.from(signals.values()),
    filters: Array.from(filters.values()),
  }
}
