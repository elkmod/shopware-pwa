import { UiCategoryFilter, UiCategoryFilterType } from "../ui-interfaces";

export interface CategoryFilterRangeValues {
  max: string;
  min: string;
}
export interface CategoryFilterEntityValues {
  [valueId: string]: CategoryFilterEntityValue;
}
export interface CategoryFilterEntityValue {
  name: string;
  description: string | null;
  customFields: any;
}

export interface CategoryFilterTermValue {
  key: string;
  count: number;
  extensions: any;
}

interface Filter {
  [filterCode: string]: {
    type: UiCategoryFilterType;
    name: string;
    values:
      | CategoryFilterRangeValues
      | CategoryFilterEntityValues
      | CategoryFilterTermValue[];
  };
}

const convertTermFilterValues = (values: CategoryFilterTermValue[]) => {
  return values.map(({ key, count }: { key: string; count: number }) => ({
    value: key,
    label: key,
    count: count
  }));
};

const convertEntityFilterValues = (
  values: CategoryFilterEntityValues,
  isColor: boolean
) => {
  return !values
    ? []
    : Object.entries(values).map(([valueId, { name }]) => ({
        value: valueId,
        label: name,
        color: isColor && name
      }));
};

const convertOptionsByType = ({
  type,
  values,
  isColor
}: {
  type: string;
  values: any;
  isColor: boolean;
}) => {
  switch (type) {
    case UiCategoryFilterType.term:
      return convertTermFilterValues(values);
    case UiCategoryFilterType.entity:
      return convertEntityFilterValues(values, isColor);
    default:
      return values;
  }
};

export function getCategoryAvailableFilters({
  filters
}: { filters?: Filter } = {}): UiCategoryFilter[] {
  if (!filters) {
    return [];
  }

  const filtersTransformed = Object.entries(filters).map(
    ([filterCode, { name, values, type }]) => ({
      name: name || filterCode,
      type: type,
      options: convertOptionsByType({
        type,
        values,
        isColor: filterCode === "color"
      })
    })
  );

  return filtersTransformed;
}