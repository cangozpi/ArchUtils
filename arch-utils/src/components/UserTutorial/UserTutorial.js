import React, { useEffect } from "react";
import Swal from "sweetalert2";
import "./UserTutorial.css";

// import sample .dxf file
import sampleDxfFile from "./Sample dxf Archutils.dxf";

function UserTutorial({ showTutorial, setShowTutorial }) {
  // Show tutorial using SweetAlert Queues
  async function playTutorial() {
    const steps = ["1", "2", "3", "4"];
    const swalQueueStep = Swal.mixin({
      confirmButtonText: "Continue",
      cancelButtonText: "Back",
      progressSteps: steps,
      //   input: "text",
      //   inputAttributes: {
      //     required: true,
      //   },
      reverseButtons: true,
      //   validationMessage: "This field is required",
    });

    const values = [];
    let currentStep;
    const tutorialScripts = [
      {
        title: `Welcome to <em>ArchUtils</em>:`,
        html: `
                <h5>Follow this short tutorial to learn about it!</h5>
          `,
      },
      {
        title: `With <em>ArchUtils</em> you can:`,
        html: `
                <ol class="user_introduction_list">
                    <li><strong>Convert</strong> your <em>.dxf</em> files to <em>.svg</em> files.</li>
                    <li>Generate <strong>displacement maps</strong> from files <em>(.dxf & .svg )</em> given 
                    that their content follows a topographic map structure.</li>
                    <li>You can <strong>visualize and interact</strong> with your displacement maps.</li>
                </ol>
          `,
      },
      {
        title: `Navigation:`,
        html: `
                Use the three tabs located at the top of the page to switch between functionalities:
                <ul class="user_introduction_list">
                    <li><em>CONVERT DXF TO SVG</em></li>
                    <li><em>GENERATE DISPLACEMENT MAP FROM SVG</em></li>
                    <li><em>GENERATE MESH FROM DISPLACEMENT MAP</em></li>
                </ul>
          `,
      },
      {
        title: `Get a Taste:`,
        html: `
                You can <a href="${sampleDxfFile}" download="Sample dxf file.dxf"><em>download</em></a> the sample <em>.dxf</em> file to check out how this all works.
          `,
      },
    ];

    for (currentStep = 0; currentStep < steps.length; ) {
      const result = await swalQueueStep
        .fire({
          title: tutorialScripts[currentStep].title,
          html: tutorialScripts[currentStep].html,
          showCancelButton: currentStep > 0,
          currentProgressStep: currentStep,
        })
        .then();

      if (result.value) {
        values[currentStep] = result.value;
        currentStep++;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        currentStep--;
      } else {
        break;
      }

      if (currentStep === steps.length) {
        // tutorial ended pop up closed
        // set tutorial taken cookie
        window.localStorage.setItem("showTutorial", JSON.stringify(false));
        // set showTutorial State
        setShowTutorial(false);
        // toast Tutorial completion
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "success",
          title: "Tutorial completed successfully",
        });
      }
    }
  }

  useEffect(() => {
    if (showTutorial == true) {
      playTutorial();
    }
  }, [showTutorial]);

  return <></>;
}

export default UserTutorial;
