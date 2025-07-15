export interface IProvince {
  _id: string; // Unique identifier for the province
  name: string; // Name of the province
  slug: string; // Slug for URL-friendly representation
  type: string; // Type of administrative division (e.g., province, city)
  name_with_type: string; // Full name with type (e.g., "Tỉnh An Giang")
  code: string; // Code representing the province
  isDeleted: boolean; // Indicates if the province is deleted or active
}

export interface IDistrict {
  _id: string; // Unique identifier for the district
  name: string; // Name of the district
  type: string; // Type of administrative division (e.g., district, town)
  slug: string; // Slug for URL-friendly representation
  name_with_type: string; // Full name with type (e.g., "Huyện An Phú")
  path: string; // Path representation (e.g., "An Phú, An Giang")
  path_with_type: string; // Full path with type (e.g., "Huyện An Phú, Tỉnh An Giang")
  code: string; // Code representing the district
  parent_code: string; // Code of the parent province
  isDeleted: boolean; // Indicates if the district is deleted or active
}

export interface IWard {
  _id: string; // Unique identifier for the ward
  name: string; // Name of the ward
  type: string; // Type of administrative division (e.g., ward, town)
  slug: string; // Slug for URL-friendly representation
  name_with_type: string; // Full name with type (e.g., "Thị trấn An Phú")
  path: string; // Path representation (e.g., "An Phú, An Phú, An Giang")
  path_with_type: string; // Full path with type (e.g., "Thị trấn An Phú, Huyện An Phú, Tỉnh An Giang")
  code: string; // Code representing the ward
  parent_code: string; // Code of the parent district
  isDeleted: boolean; // Indicates if the ward is deleted or active
}