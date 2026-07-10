export type DummyUser = {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  hair: {
    color: string;
  };
  address: {
    postalCode: string | number;
  };
  company: {
    department: string;
  };
};

export type DepartmentSummary = {
  male: number;
  female: number;
  ageRange: string;
  hair: {
    [color: string]: number;
  };
  addressUser: {
    [firstNameLastName: string]: string;
  };
};

export type DepartmentSummaryMap = {
  [department: string]: DepartmentSummary;
};
