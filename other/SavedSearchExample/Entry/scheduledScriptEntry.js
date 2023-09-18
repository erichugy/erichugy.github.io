/**
 * @NApiVersion 2.1
 * @NAmdConfig ../config.json
 * @NScriptType ScheduledScript
 * @file Module to query the KPIs
 */
define([
    "N/record","N/log",
    "uc","cs",
],(
    Nrecord, Nlog,
    uc,cs
) => {

    return {
        execute: execute,
    }

    function execute(){
        Nlog.audit("Running Scheduled KPI Parser");
        try{
            let kpiRec = createKpiRecord();


            for (let i = 0; i < 3; i ++){
                let name = cs.EVERYONE[i % 3];
                Nlog.debug("Name", name + " | Iteration " + i);

                let billsCreated        = uc.getSearchInternalIdCount(1 + i),
                billCreditCreated       = uc.getSearchInternalIdCount(4 + i),
                billsRejected           = uc.getSearchCount(7+i),
                monthlyCreated          = uc.getSearchInternalIdCount(`${1 + i}_1`),
                monthlyRejected         = uc.getSearchCount(`${7 + i}_1`),
                billsSubmitted          = uc.getSearchCount(`10_${i+1}`);

                let rejectionRate = monthlyCreated != 0 ? Math.round(monthlyRejected/monthlyCreated * 100)/100 : 0;

                kpiRec.setValue({fieldId:`custrecord_bills_created_${name}`             , value: billsCreated       });
                kpiRec.setValue({fieldId:`custrecord_bill_credits_created_${name}`      , value: billCreditCreated  });
                kpiRec.setValue({fieldId:`custrecord_bills_rejected_${name}`            , value: billsRejected      });
                kpiRec.setValue({fieldId:`custrecord_kpi_bill_unrcvd_inv_${name}`       , value: billsSubmitted     });
                kpiRec.setValue({fieldId:`custrecord_monthly_rejection_${name}`         , value: rejectionRate      })

                Nlog.debug("Set results for " + name, `Bills Created: ${billsCreated} | Bill Credits: ${billCreditCreated} | Rejected: ${billsRejected} | Submitted: ${billsSubmitted} | Rejection Rate: ${rejectionRate}`);
            }
            let billsPendingApproval    = uc.getSearchCount(11);
            let billsInInvoiceQueue     = uc.getSearchCount(12);
            let billsRejectedEod        = uc.getSearchCount(13);
            let billsPendingSubmission  = uc.getSearchInternalIdCount(14);
            let avgHoursToCreateBill    = Math.round(parseFloat(uc.getSearchInternalIdCount(15, name = "formulanumeric", summary = "AVG")) * 100) / 100;
            let avgHoursToApproveBill   = Math.round(uc.getSearchAvgByCol(16) * 100)/100;

            kpiRec.setValue({fieldId:`custrecord_vb_pending_mgmt_approval`      , value: billsPendingApproval   });
            kpiRec.setValue({fieldId:`custrecord_vb_in_queue`                   , value: billsInInvoiceQueue    });
            kpiRec.setValue({fieldId:`custrecord_rejected_invoices`             , value: billsRejectedEod       });
            kpiRec.setValue({fieldId:`custrecord_bills_pending_submission`      , value: billsPendingSubmission });

            kpiRec.setValue({fieldId:`custrecord_hr_to_create_vb`               , value: avgHoursToCreateBill       });
            kpiRec.setValue({fieldId:`custrecord_hr_to_approve_vb`              , value: avgHoursToApproveBill      });
            // kpiRec.setValue({fieldId:`custrecord_hr_to_resubmit_vb_approval`    , value: avgTimeToCreateBill    }); // not deployed yet

            Nlog.debug("Other Results", `Pending Approval: ${billsPendingApproval}\nInvoice Queue: ${billsInInvoiceQueue}\n\
                        Rejected Invoices: ${billsRejectedEod}\nPending Submission: ${billsPendingSubmission}\n\
                        Time to Create: ${avgHoursToCreateBill}\nTime to Approve: ${avgHoursToApproveBill}`);

            kpiRec.save();
            Nlog.audit("Saved kpi", kpiRec);

        } catch (e) {
            Nlog.error("Error" ,e.message);
        }
    }

    function createKpiRecord(){
        Nlog.debug("Started Creating KPI", "...")
        let kpiRec = Nrecord.create({type:"customrecord_daily_ap_kpi"});
        kpiRec.setValue({fieldId: "custrecord_kpi_date", value: uc.yesterday()});

        return kpiRec;
    }

});