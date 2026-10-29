export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'MedCore HMS Enterprise REST API',
    version: '1.0.0',
    description: 'Enterprise-grade Hospital Management System REST API following the MedCore HMS 15-Page Specification. Supports multi-tenant isolation, 9-role RBAC, 4-stage laboratory workflows, FIFO batch pharmacy dispensing, and HIPAA-compliant audit logging.',
    contact: {
      name: 'MedCore Health Informatics Team',
      email: 'api-support@medcore.hospital'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: '/api',
      description: 'Active Application API Server'
    }
  ],
  tags: [
    { name: 'Authentication & Roles', description: '9-Role session management and context switching' },
    { name: 'Multi-Tenancy', description: 'Hospital tenant isolation and facility management' },
    { name: 'Patients & EMR', description: 'Patient registry, demographics, triage, and soft-delete' },
    { name: 'Scheduling', description: 'Double-booking prevention, doctor shifts, and reminders' },
    { name: 'Clinical Consultation', description: 'SOAP clinical encounters and digital signatures' },
    { name: 'Laboratory Diagnostics', description: '4-stage lab requisitions: Order -> Sample -> Process -> Approve' },
    { name: 'Pharmacy & Dispensing', description: 'FIFO batch inventory tracking by expiration date' },
    { name: 'Inpatient & Wards', description: 'Bed occupancy, admissions, sanitization, and discharge' },
    { name: 'Billing & Claims', description: 'Consolidated invoices, insurance copay, Stripe webhook' },
    { name: 'Analytics', description: 'Revenue breakdowns, bed census, and clinic KPIs' },
    { name: 'Notifications', description: 'Event-driven multi-channel alerts (In-App, Email, SMS)' },
    { name: 'AI Clinical Copilot', description: 'Server-side Gemini clinical decision support and drug safety' }
  ],
  paths: {
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health check and tenant context',
        description: 'Returns server operational status, active hospital tenant, and database engine readiness.',
        responses: {
          '200': {
            description: 'System is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'healthy' },
                    version: { type: 'string', example: '2.4.0' },
                    activeHospital: { type: 'string', example: 'Metropolitan Medical Center' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/system/blueprint': {
      get: {
        tags: ['System'],
        summary: 'Enterprise System Blueprint & 20-Step Order Specification',
        description: 'Returns the full structural role hierarchy, tech stack components, and 20-step development roadmap.',
        responses: {
          '200': {
            description: 'System blueprint metadata'
          }
        }
      }
    },
    '/system/run-verification-tests': {
      post: {
        tags: ['System'],
        summary: 'Execute 6-Point Security & Integrity Test Suite',
        description: 'Runs real-time tests for multi-tenant isolation, patient privacy, double-booking prevention, token rotation, pharmacy FIFO safety, and billing math.',
        responses: {
          '200': {
            description: 'Test suite results with millisecond execution durations and assertion outcomes'
          }
        }
      }
    },
    '/hospitals': {
      get: {
        tags: ['Multi-Tenancy'],
        summary: 'List registered hospital facilities',
        description: 'Returns tenant hospitals with capacities, departments, and active patient counts.',
        responses: {
          '200': {
            description: 'Hospital list retrieved'
          }
        }
      }
    },
    '/hospitals/switch': {
      post: {
        tags: ['Multi-Tenancy'],
        summary: 'Switch active hospital tenant',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['hospitalId'],
                properties: {
                  hospitalId: { type: 'string', example: 'hosp-1' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Tenant switched successfully' }
        }
      }
    },
    '/patients': {
      get: {
        tags: ['Patients & EMR'],
        summary: 'List patients with filtering and pagination',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search by name, MRN, or phone' },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['ALL', 'OUTPATIENT', 'INPATIENT', 'EMERGENCY', 'DISCHARGED'] } },
          { name: 'bloodGroup', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } }
        ],
        responses: {
          '200': {
            description: 'List of patients matching query'
          }
        }
      },
      post: {
        tags: ['Patients & EMR'],
        summary: 'Register new patient with auto-generated MRN',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['firstName', 'lastName', 'dob', 'gender', 'bloodGroup', 'phone'],
                properties: {
                  firstName: { type: 'string', example: 'Lucas' },
                  lastName: { type: 'string', example: 'Montgomery' },
                  dob: { type: 'string', example: '1988-04-12' },
                  gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'] },
                  bloodGroup: { type: 'string', example: 'O+' },
                  phone: { type: 'string', example: '+1 (555) 432-8899' },
                  email: { type: 'string', example: 'lucas.m@example.com' },
                  insuranceProvider: { type: 'string', example: 'Blue Cross Blue Shield' },
                  policyNumber: { type: 'string', example: 'BCBS-890214' }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Patient registered successfully' }
        }
      }
    },
    '/appointments': {
      get: {
        tags: ['Scheduling'],
        summary: 'Get appointments schedule',
        parameters: [
          { name: 'doctorId', in: 'query', schema: { type: 'string' } },
          { name: 'date', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'List of appointments' }
        }
      },
      post: {
        tags: ['Scheduling'],
        summary: 'Book consultation with conflict check',
        description: 'Checks for overlapping doctor slots and prevents race conditions (HTTP 409 if double-booked).',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['patientId', 'doctorId', 'appointmentDate', 'startTime', 'endTime'],
                properties: {
                  patientId: { type: 'string', example: 'p-1' },
                  doctorId: { type: 'string', example: 'doc-1' },
                  appointmentDate: { type: 'string', example: '2026-09-21' },
                  startTime: { type: 'string', example: '09:00' },
                  endTime: { type: 'string', example: '09:30' },
                  reason: { type: 'string', example: 'Hypertension Follow-Up' }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Appointment confirmed and reminders scheduled' },
          '409': {
            description: 'Conflict error - slot unavailable',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: {
                      type: 'object',
                      properties: {
                        code: { type: 'string', example: 'SLOT_UNAVAILABLE' },
                        message: { type: 'string', example: 'This slot was just booked by another patient.' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/lab-orders': {
      get: {
        tags: ['Laboratory Diagnostics'],
        summary: 'List diagnostic lab requisitions',
        responses: {
          '200': { description: 'List of 4-stage laboratory orders' }
        }
      },
      post: {
        tags: ['Laboratory Diagnostics'],
        summary: 'Create lab requisition',
        responses: {
          '201': { description: 'Lab order generated with specimen barcoding' }
        }
      }
    },
    '/lab-orders/{id}/status': {
      patch: {
        tags: ['Laboratory Diagnostics'],
        summary: 'Advance lab order workflow stage',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['ORDERED', 'SAMPLE_COLLECTED', 'PROCESSING', 'PENDING_APPROVAL', 'APPROVED'] },
                  results: { type: 'array', items: { type: 'object' } },
                  technicianNotes: { type: 'string' },
                  approvalRemarks: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Order stage updated' }
        }
      }
    },
    '/lab-orders/{id}/result': {
      patch: {
        tags: ['Laboratory Diagnostics'],
        summary: 'Enter quantitative laboratory analyzer results',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['results'],
                properties: {
                  results: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        parameter: { type: 'string', example: 'Serum Potassium' },
                        resultValue: { type: 'string', example: '4.2' },
                        unit: { type: 'string', example: 'mmol/L' },
                        referenceRange: { type: 'string', example: '3.5 - 5.0' },
                        flag: { type: 'string', enum: ['NORMAL', 'LOW', 'HIGH', 'CRITICAL'] }
                      }
                    }
                  },
                  technicianNotes: { type: 'string', example: 'Automated assay calibrated within standard deviation.' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Results recorded and submitted for pathologist sign-off' }
        }
      }
    },
    '/medicines': {
      get: {
        tags: ['Pharmacy & Dispensing'],
        summary: 'Get consolidated drug catalog with current stock',
        responses: {
          '200': { description: 'Medicines catalog with aggregated batch counts' }
        }
      }
    },
    '/pharmacy/batches': {
      get: {
        tags: ['Pharmacy & Dispensing'],
        summary: 'List FIFO medicine inventory batches',
        description: 'Batches sorted ascending by expiration date for First-In, First-Out clinical safety.',
        responses: {
          '200': { description: 'Batch inventory with rack locations and expiration dates' }
        }
      }
    },
    '/pharmacy/dispense': {
      post: {
        tags: ['Pharmacy & Dispensing'],
        summary: 'Execute FIFO medicine dispensing',
        description: 'Deducts quantity from earliest non-expired batch. Throws error if expired or out of stock.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['prescriptionId'],
                properties: {
                  prescriptionId: { type: 'string', example: 'rx-doc-101' },
                  medicineName: { type: 'string', example: 'Amlodipine Besylate' },
                  quantity: { type: 'integer', example: 30 }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Dispensed successfully' },
          '400': { description: 'Validation failure or expired batch blocked' }
        }
      }
    },
    '/invoices': {
      get: {
        tags: ['Billing & Claims'],
        summary: 'List patient invoices and insurance claims',
        responses: {
          '200': { description: 'Invoices list' }
        }
      },
      post: {
        tags: ['Billing & Claims'],
        summary: 'Generate consolidated hospital invoice',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['patientId', 'items'],
                properties: {
                  patientId: { type: 'string', example: 'p-1' },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        description: { type: 'string', example: 'Cardiac Stress Test & Consultation' },
                        category: { type: 'string', example: 'CONSULTATION' },
                        amount: { type: 'number', example: 250 }
                      }
                    }
                  },
                  insuranceCoverageRate: { type: 'number', example: 80 }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Invoice generated and claim dispatched' }
        }
      }
    },
    '/payments/webhook/stripe': {
      post: {
        tags: ['Billing & Claims'],
        summary: 'Stripe payment gateway webhook receiver',
        description: 'Reconciles payment intents, updates invoice status to PAID, and dispatches patient receipts.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  type: { type: 'string', example: 'payment_intent.succeeded' },
                  data: {
                    type: 'object',
                    properties: {
                      object: {
                        type: 'object',
                        properties: {
                          metadata: {
                            type: 'object',
                            properties: {
                              invoiceId: { type: 'string', example: 'inv-1' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Webhook received and processed' }
        }
      }
    },
    '/analytics/revenue': {
      get: {
        tags: ['Analytics'],
        summary: 'Hospital financial and department revenue analytics',
        responses: {
          '200': { description: 'Department revenue breakdowns, monthly trends, and gateway splits' }
        }
      }
    },
    '/notifications/me': {
      get: {
        tags: ['Notifications'],
        summary: 'Get notifications for current authenticated user',
        responses: {
          '200': { description: 'Notification stream with read/unread flags' }
        }
      }
    },
    '/auth/switch-role': {
      post: {
        tags: ['Authentication & Roles'],
        summary: 'Switch active user role between 9 supported roles',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['role'],
                properties: {
                  role: {
                    type: 'string',
                    enum: [
                      'SUPER_ADMIN',
                      'HOSPITAL_ADMIN',
                      'DOCTOR',
                      'NURSE',
                      'RECEPTIONIST',
                      'LAB_TECHNICIAN',
                      'PHARMACIST',
                      'ACCOUNTANT',
                      'PATIENT'
                    ]
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Role switched' }
        }
      }
    }
  }
};

export function getSwaggerHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MedCore HMS - OpenAPI 3.0 & Swagger UI</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #f8fafc;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .topbar {
      background: #0f172a !important;
      padding: 14px 24px !important;
      border-bottom: 2px solid #0d9488;
    }
    .topbar-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1460px;
      margin: 0 auto;
    }
    .brand-title {
      color: #ffffff;
      font-size: 18px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .badge {
      background: #0d9488;
      color: white;
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: 600;
    }
    .swagger-ui .info {
      margin: 30px 0 20px !important;
    }
    .swagger-ui .info .title {
      font-family: 'Plus Jakarta Sans', sans-serif !important;
      color: #0f172a !important;
    }
    .swagger-ui .opblock.opblock-get { background: rgba(59, 130, 246, 0.05); border-color: #3b82f6; }
    .swagger-ui .opblock.opblock-post { background: rgba(16, 185, 129, 0.05); border-color: #10b981; }
    .swagger-ui .opblock.opblock-patch { background: rgba(245, 158, 11, 0.05); border-color: #f59e0b; }
    .swagger-ui .opblock.opblock-delete { background: rgba(239, 68, 68, 0.05); border-color: #ef4444; }
  </style>
</head>
<body>
  <div class="topbar">
    <div class="topbar-wrapper">
      <div class="brand-title">
        <span>🏥 MedCore HMS</span>
        <span class="badge">OpenAPI 3.0 Contract</span>
      </div>
      <div style="color: #94a3b8; font-size: 12px;">
        Pages 16–17 Specification Compliance
      </div>
    </div>
  </div>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" charset="UTF-8"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js" charset="UTF-8"></script>
  <script>
    window.onload = function() {
      window.ui = SwaggerUIBundle({
        url: "/api/docs/openapi.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>`;
}
