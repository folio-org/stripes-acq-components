export const institution = {
  id: '28a372df-a8c9-439e-91fd-6d606b52e1f4',
  name: 'Test institution',
  code: 'TS',
};

export const campus = {
  id: '34790631-dd30-4ed0-b895-39125d866e44',
  name: 'Riverside Campus',
  code: 'RS',
  institutionId: [institution.id],
};

export const library = {
  id: 'e81d1fc0-6801-4dec-b9b9-e105fa575cf0',
  name: 'Main Library',
  code: 'ML',
  campusId: [campus.id],
};

export const location = {
  id: 'd9cd0bed-1b49-4b5e-a7bd-064b8d177231',
  name: 'Miller General Stacks',
  code: 'TS/RS/ML/GS',
  isActive: true,
  description: 'The very general stacks of Miller',
  discoveryDisplayName: 'Miller General',
  institutionId: [institution.id],
  campusId: [campus.id],
  libraryId: [library.id],
  details: {
    a: 'b',
    foo: 'bar',
  },
  primaryServicePoint: '79faacf1-4ba4-42c7-8b2a-566b259e4641',
  servicePointIds: [
    '79faacf1-4ba4-42c7-8b2a-566b259e4641',
  ],
};
