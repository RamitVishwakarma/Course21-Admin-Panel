export interface Module {
  id: number;
  name: string;
  course_id: number;
  image_path: string | null;
  index: number | null;
  lectures: Lecture[];
}

export interface Lecture {
  id: number;
  course_id: number | null;
  prefix: string | null;
  name: string;
  file_id: string | null;
  is_trial: boolean | null;
  image_path: string | null;
  video_id: string;
  created_at: string;
  updated_at: string;
  index: number;
  module_id: number;
  transcodingjob?: {
    video_id: string | null;
    status: string;
  };
}

export interface Course {
  id: number;
  prefix: string | null;
  name: string;
  validity: string | null;
  manager: string | null;
  price: number;
  image_path: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  category_id: number | null;
  modules: Module[];
}

export const CourseData: Course[] = [
  {
    id: 96,
    prefix: null,
    name: 'Course 1',
    validity: null,
    manager: null,
    price: 4999,
    image_path:
      'http://64.23.187.184/storage/courses/530b8c53-8311-4e77-b780-418b503c1c8a.png',
    created_at: '2024-05-26T20:53:13.000000Z',
    updated_at: '2024-05-26T20:53:13.000000Z',
    deleted_at: null,
    category_id: null,
    modules: [
      {
        id: 40,
        name: 'Module 1',
        course_id: 96,
        image_path: 'modules/46041251-9122-4cfa-b89c-e327238669bb.png',
        index: 1,
        lectures: [],
      },
      {
        id: 43,
        name: 'Module 4',
        course_id: 96,
        image_path: 'modules/1e68971c-1597-4f42-a885-eade5b8c3846.png',
        index: 2,
        lectures: [],
      },
      {
        id: 42,
        name: 'Module 3',
        course_id: 96,
        image_path: 'modules/1edb244f-0fc3-44cb-9509-b82901bd4209.png',
        index: 3,
        lectures: [],
      },
      {
        id: 41,
        name: 'Module 2',
        course_id: 96,
        image_path: 'modules/f696c1c2-0e90-4dd6-a7ba-94b17d77af36.png',
        index: 4,
        lectures: [],
      },
    ],
  },
  {
    id: 97,
    prefix: null,
    name: 'Course 2',
    validity: null,
    manager: null,
    price: 1299,
    image_path:
      'http://64.23.187.184/storage/courses/98f9ff10-e806-402d-b769-de525158b818.png',
    created_at: '2024-05-23T11:46:50.000000Z',
    updated_at: '2024-05-23T11:46:50.000000Z',
    deleted_at: null,
    category_id: null,
    modules: [
      {
        id: 53,
        name: 'arpa',
        course_id: 97,
        image_path: null,
        index: null,
        lectures: [
          {
            id: 86,
            course_id: null,
            prefix: null,
            name: 'arpan',
            file_id: null,
            is_trial: null,
            image_path: null,
            video_id: '',
            created_at: '2025-01-13T12:02:54.000000Z',
            updated_at: '2025-01-13T12:02:54.000000Z',
            index: 1,
            module_id: 53,
            transcodingjob: {
              video_id: null,
              status: 'pending',
            },
          },
        ],
      },
    ],
  },
  {
    id: 98,
    prefix: null,
    name: 'Course 3',
    validity: null,
    manager: null,
    price: 1499,
    image_path:
      'http://64.23.187.184/storage/courses/3fe98d49-4b72-4975-a227-9712da82ab48.png',
    created_at: '2024-05-23T11:47:03.000000Z',
    updated_at: '2024-05-23T11:47:03.000000Z',
    deleted_at: null,
    category_id: null,
    modules: [],
  },
  {
    id: 99,
    prefix: null,
    name: 'Course 4',
    validity: null,
    manager: null,
    price: 1999,
    image_path:
      'http://64.23.187.184/storage/courses/c994a234-5ee5-442b-ad06-7853f714fd12.png',
    created_at: '2024-05-23T11:47:13.000000Z',
    updated_at: '2024-05-23T11:47:13.000000Z',
    deleted_at: null,
    category_id: null,
    modules: [],
  },
  {
    id: 100,
    prefix: null,
    name: 'Course 5',
    validity: null,
    manager: null,
    price: 2999,
    image_path:
      'http://64.23.187.184/storage/courses/071d1c93-647d-48b5-b38a-ac7bf6b98ba0.png',
    created_at: '2024-05-23T11:47:24.000000Z',
    updated_at: '2024-05-23T11:47:24.000000Z',
    deleted_at: null,
    category_id: null,
    modules: [],
  },
  {
    id: 101,
    prefix: null,
    name: 'Course 6',
    validity: null,
    manager: null,
    price: 3999,
    image_path:
      'http://64.23.187.184/storage/courses/2a02c4df-6afb-4324-9964-2f26e224d864.png',
    created_at: '2024-05-23T11:47:37.000000Z',
    updated_at: '2024-05-23T11:47:37.000000Z',
    deleted_at: null,
    category_id: null,
    modules: [],
  },
  {
    id: 102,
    prefix: null,
    name: 'Course 7',
    validity: null,
    manager: null,
    price: 4999,
    image_path:
      'http://64.23.187.184/storage/courses/f4352f7f-7b69-4cbc-abbf-e1756a5eda6d.png',
    created_at: '2024-05-23T11:47:45.000000Z',
    updated_at: '2024-05-23T11:47:45.000000Z',
    deleted_at: null,
    category_id: null,
    modules: [
      {
        id: 49,
        name: 'admin',
        course_id: 102,
        image_path: 'modules/b4aeeeb4-44d4-41d1-a397-2e3024853eeb.png',
        index: null,
        lectures: [],
      },
    ],
  },
  {
    id: 103,
    prefix: null,
    name: 'Course 8',
    validity: null,
    manager: null,
    price: 5999,
    image_path:
      'http://64.23.187.184/storage/courses/330bde97-ed17-4366-aa8b-b6b94ed4f344.png',
    created_at: '2024-05-23T11:48:00.000000Z',
    updated_at: '2024-05-23T11:48:00.000000Z',
    deleted_at: null,
    category_id: null,
    modules: [],
  },
  {
    id: 105,
    prefix: null,
    name: 'Course 10',
    validity: null,
    manager: null,
    price: 10999,
    image_path:
      'http://64.23.187.184/storage/courses/3d9a7afd-ce0e-4c5a-9cf6-7f257effeedb.png',
    created_at: '2024-05-23T11:48:30.000000Z',
    updated_at: '2024-05-23T11:48:30.000000Z',
    deleted_at: null,
    category_id: null,
    modules: [],
  },
  {
    id: 107,
    prefix: null,
    name: 'Course 12',
    validity: null,
    manager: null,
    price: 12999,
    image_path:
      'http://64.23.187.184/storage/courses/826852c8-140c-41f8-ab17-a86ba319243a.png',
    created_at: '2024-05-23T11:48:46.000000Z',
    updated_at: '2024-05-23T11:48:46.000000Z',
    deleted_at: null,
    category_id: null,
    modules: [
      {
        id: 48,
        name: 'New',
        course_id: 107,
        image_path: null,
        index: null,
        lectures: [
          {
            id: 82,
            course_id: null,
            prefix: null,
            name: 'New Test Lecture',
            file_id: null,
            is_trial: null,
            image_path:
              'lectures/images/13f0ea2f-4eba-48fc-a672-a752e7782b4b.png',
            video_id: 'UP-20240901101624-11YPwL9jIBSVKudz-MP01XOci',
            created_at: '2024-09-01T10:16:24.000000Z',
            updated_at: '2024-09-03T11:21:50.000000Z',
            index: 1,
            module_id: 48,
            transcodingjob: {
              video_id: null,
              status: 'completed',
            },
          },
        ],
      },
    ],
  },
  {
    id: 127,
    prefix: null,
    name: 'Course 13',
    validity: null,
    manager: null,
    price: 21,
    image_path: null,
    created_at: '2024-11-16T08:16:55.000000Z',
    updated_at: '2024-11-16T08:16:55.000000Z',
    deleted_at: null,
    category_id: null,
    modules: [
      {
        id: 51,
        name: 'Module 1',
        course_id: 127,
        image_path: null,
        index: 1,
        lectures: [],
      },
      {
        id: 52,
        name: 'Module 3',
        course_id: 127,
        image_path: null,
        index: 2,
        lectures: [],
      },
      {
        id: 50,
        name: 'Module 2',
        course_id: 127,
        image_path: null,
        index: 3,
        lectures: [],
      },
    ],
  },
];

export default CourseData;
