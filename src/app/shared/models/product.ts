export interface Product {

    name: string;
    image: string;
    strainType: string;
    thcRange: string;
    location: string;
    posted: string;
    flavour: string
}

export interface IProduct {
    available: string;
    bud_size: string;
    categories: Category;
    category: string;
    cbd: number;
    coa_document: string;
    created_at: string;
    description: string;
    dry_method: string;
    dry_methods: DryMethod;
    grade: string;
    grow_media: string;
    grow_medias: GrowMedia;
    growth_method: string;
    growth_methods: GrowthMethod;
    harvest_date: string;
    id: string;
    images: string[];
    irradiated: boolean;
    lineage: string;
    location: Location;
    lowers: number;
    mids: number;
    name: string;
    rating: number;
    strain_type: string;
    strain_types: StrainType;
    subCategory: SubCategory;
    sub_category: string;
    terpene: number;
    thc_range: string;
    thc_ranges: ThcRange;
    thc_total: number;
    tops: number;
    trim_method: string;
    trim_methods: TrimMethod;
    updated_at: string;
    user_id: string;
    vendor?:Vendor;

  }
  
  export interface Category {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface DryMethod {
    id: string;
    method: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface GrowMedia {
    id: string;
    media: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface GrowthMethod {
    id: string;
    method: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Location {
    crs: any; // Adjust the type according to your specific needs
    type: string;
    coordinates: number[];
  }
  
  export interface StrainType {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface SubCategory {
    id: string;
    name: string;
    category_id: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ThcRange {
    id: string;
    range: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface TrimMethod {
    id: string;
    method: string;
    createdAt: string;
    updatedAt: string;
  }
  

  export interface Vendor {
    id: string;
    name: string;
    phone_no: string;
    email: string;
    avatar: string;
    company: Company;
  }
  
  export interface Company {
    id: string;
    userId: string;
    company_name: string;
    business_type: string;
    contact_no: string;
    business_id_no: string;
    health_license: string;
    business_location: BusinessLocation;
    createdAt: string;
    updatedAt: string;
    distance: number;
    subscribed: boolean;
  }
  
  export interface BusinessLocation {
    crs: CRS;
    type: string;
    coordinates: number[];
  }
  
  export interface CRS {
    type: string;
    properties: CRSProperties;
  }
  
  export interface CRSProperties {
    name: string;
  }
  

