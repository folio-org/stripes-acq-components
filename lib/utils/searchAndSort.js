// should be bound to the component context, like `this.getActiveFilters = getActiveFilters.bind(this);`
export function getActiveFilters() {
  const { query } = this.props.resources;

  if (!query || !query.filters) return {};

  return query.filters
    .split(',')
    .reduce((filterMap, currentFilter) => {
      const [name, value] = currentFilter.split('.');

      if (!Array.isArray(filterMap[name])) {
        filterMap[name] = [];
      }

      filterMap[name].push(value);

      return filterMap;
    }, {});
}

// should be bound to the component context, like `this.handleFilterChange = handleFilterChange.bind(this);`
export function handleFilterChange({ name, values }) {
  const { mutator } = this.props;
  const newFilters = {
    ...this.getActiveFilters(),
    [name]: values,
  };

  const filters = Object.keys(newFilters)
    .map((filterName) => {
      return newFilters[filterName]
        .map((filterValue) => `${filterName}.${filterValue}`)
        .join(',');
    })
    .filter(filter => filter)
    .join(',');

  mutator.query.update({ filters });
}
