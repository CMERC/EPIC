export const participantValues = {
  platformValues: [
    { id: 1, value: 'F/A-18', title: 'F/A-18' },
    { id: 2, value: 'F-15', title: 'F-15' },
    { id: 3, value: 'F-16', title: 'F-16' },
    { id: 4, value: 'HH-60', title: 'HH-60' },
    { id: 5, value: 'HIMARS', title: 'HIMARS' },
    { id: 6, value: 'Intel', title: 'Intel' },
    { id: 7, value: 'JTAC', title: 'JTAC' },
    { id: 8, value: 'KC-10', title: 'KC-10' },
    { id: 9, value: 'KC-130J', title: 'KC-130J' },
    { id: 10, value: 'KC-135', title: 'KC-135' },
    { id: 11, value: 'MC-130H', title: 'MC-130H' },
    { id: 12, value: 'MC-130J', title: 'MC-130J' },
    { id: 13, value: 'MC-130P', title: 'MC-130P' },
    { id: 14, value: 'Medical (SOFME)', title: 'Medical (SOFME)' },
    { id: 15, value: 'Medical (SORTS)', title: 'Medical (SORTS)' },
    { id: 16, value: 'MH-47', title: 'MH-47' },
    { id: 17, value: 'MH-60', title: 'MH-60' },
    { id: 18, value: 'MQ-1', title: 'MQ-1' },
    { id: 19, value: 'MQ-9', title: 'MQ-9' },
    { id: 20, value: 'MSOT', title: 'MSOT' },
    { id: 21, value: 'MV-22', title: 'MV-22' },
    { id: 22, value: 'ODA', title: 'ODA' },
    { id: 23, value: 'ODB', title: 'ODB' },
    { id: 24, value: 'OH-58', title: 'OH-58' },
    { id: 25, value: 'MC-12', title: 'MC-12' },
    { id: 26, value: 'Raven', title: 'Raven' },
    { id: 27, value: 'RQ-20 (Puma)', title: 'RQ-20 (Puma)' },
    { id: 28, value: 'SOC-R', title: 'SOC-R' },
    { id: 29, value: 'JSOAD', title: 'JSOAD' },
    { id: 30, value: 'SOWT', title: 'SOWT' },
    { id: 31, value: 'SR Team', title: 'SR Team' },
    { id: 32, value: 'STS', title: 'STS' }
  ],
  platformTypeValues: [
    { id: 1, value: 'Airspace', title: 'Airspace' },
    { id: 2, value: 'Communications', title: 'Communications' },
    { id: 3, value: 'Fixed Wing', title: 'Fixed Wing' },
    { id: 4, value: 'Intel', title: 'Intel' },
    { id: 5, value: 'I/O', title: 'I/O (PA, CBT CAM)' },
    { id: 6, value: 'Logistics', title: 'Logistics' },
    { id: 7, value: 'Maritime', title: 'Maritime' },
    { id: 8, value: 'Manpower/Personnel', title: 'Manpower/Personnel' },
    { id: 9, value: 'Medical', title: 'Medical' },
    { id: 10, value: 'Rotary Wing', title: 'Rotary Wing' },
    { id: 11, value: 'Simulator', title: 'Simulator' },
    { id: 12, value: 'SOF Team', title: 'SOF Team' },
    { id: 13, value: 'Space', title: 'Space' },
    { id: 14, value: 'Weather', title: 'Weather' }
  ],
  fundingValues: [
    {
      id: 1,
      title: 'JEP',
      subSources: [
        {
          id: 1,
          title: 'JETP'
        },
        {
          id: 2,
          title: 'JTCP'
        },
        {
          id: 3,
          title: 'PH/IT'
        }
      ]
    },
    {
      id: 2,
      title: 'MFP-11',
      subSources: [
        {
          id: 1,
          title: 'SOCOM UFR'
        },
        {
          id: 2,
          title: 'D-CELL'
        }
      ]
    },
    {
      id: 3,
      title: 'SIF',
      subSources: [
        {
          id: 1,
          title: 'USAF'
        },
        {
          id: 2,
          title: 'ACC'
        },
        {
          id: 3,
          title: 'AFSOC'
        },
        {
          id: 4,
          title: 'USA'
        },
        {
          id: 5,
          title: 'USASOC'
        }
      ]
    },
    {
      id: 4,
      title: 'JNTC PEP (USAF Direct)'
    },
    {
      id: 5,
      title: 'JNTC PEP (SOCOM Adaptive)'
    },
    {
      id: 6,
      title: 'USAF SIF (ACC)'
    },
    {
      id: 7,
      title: 'USAF SIF (ACC)'
    },
    {
      id: 8,
      title: 'USAF SIF (AFSOC)'
    },
    {
      id: 9,
      title: 'USAF SIF (Conventional)'
    }
  ],
  methodValues: [
    { id: 0, title: 'None' },
    { id: 1, title: 'Live' },
    { id: 2, title: 'Virtual' },
    { id: 3, title: 'Constructive' },
    { id: 4, title: 'Integrated LVC' }
  ],
  trainingPriorityValues: [
    { id: 1, title: 'High', value: 0, class: 'is-danger' },
    { id: 2, title: 'Medium', value: 1, class: 'is-lightOrange' },
    { id: 3, title: 'Low', value: 2, class: 'is-warning' }
  ],
  classificationValues: [
    { id: 1, title: 'Unclassified' },
    { id: 2, title: 'Classified' }
  ],
  jointStaffTrainingValues: [
    { id: 1, title: 'Contested Enviornments in Joint Training' },
    { id: 2, title: 'Conventional and SOF Interoperability in Joint Training' },
    { id: 3, title: 'Countering WMD in Joint Training' },
    { id: 4, title: 'Joint Force Leaders in Joint Training' },
    { id: 5, title: 'Multi-domain Joint Training' }
  ],
  injectTypeValues: [
    { id: 1, title: 'Key' },
    { id: 2, title: 'Enabling' },
    { id: 3, title: 'Supporting' }
  ],
  injectUpdateMethodValues: [
    { id: 1, title: 'Email' },
    { id: 2, title: 'Chat' },
    { id: 3, title: 'Phone' },
    { id: 4, title: 'OSINT' },
    { id: 5, title: 'Radio Call' },
    { id: 6, title: 'White Card' },
    { id: 7, title: 'Media' },
    { id: 8, title: 'Social Media' }
  ],
  injectUpdateOwnerValues: [
    { id: 1, title: 'C2' },
    { id: 2, title: 'J1' },
    { id: 3, title: 'J2' },
    { id: 4, title: 'J3' },
    { id: 5, title: 'J4' },
    { id: 6, title: 'J6' },
    { id: 7, title: 'IA' },
    { id: 8, title: 'IO' },
    { id: 9, title: 'Medical' }
  ],
  injectStatusValues: [
    { id: 1, title: 'Draft' },
    { id: 2, title: 'Pending Approval' },
    { id: 3, title: 'Approved' }
  ],
  tablePageLengths: [
    { id: 1, value: '5', display: '5 per page' },
    { id: 2, value: '10', display: '10 per page' },
    { id: 3, value: '15', display: '15 per page' },
    { id: 4, value: '20', display: '20 per page' },
    { id: 5, value: '25', display: '25 per page' },
    { id: 6, value: '30', display: '30 per page' }
  ],
  primarySourceValues: [
    { id: 1, title: 'JEP' },
    { id: 2, title: 'MFP-1' },
    { id: 3, title: 'MFP-2' },
    { id: 4, title: 'MFP-3' },
    { id: 5, title: 'MFP-4' },
    { id: 6, title: 'MFP-5' },
    { id: 7, title: 'MFP-6' },
    { id: 8, title: 'MFP-7' },
    { id: 9, title: 'MFP-8' },
    { id: 10, title: 'MFP-9' },
    { id: 11, title: 'MFP-10' },
    { id: 12, title: 'MFP-11' },
    { id: 13, title: 'MFP-12' },
    { id: 14, title: 'JNTC PEP' },
    { id: 15, title: 'SIF' }
  ],
  subSourceValues: [
    { id: 1, title: 'JTCP' },
    { id: 2, title: 'JETP' },
    { id: 3, title: 'PH/IT' },
    { id: 4, title: 'UFR' },
    { id: 5, title: 'Organization Direct' },
    { id: 6, title: 'Sub-Organization Adaptive' }
  ]
}
