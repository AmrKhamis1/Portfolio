    // Add animation to the skill bars on page load
    document.addEventListener('DOMContentLoaded', function() {
        const skills = document.querySelectorAll('.skill-bar-fill');
        skills.forEach(skill => {
          const width = skill.style.width;
          skill.style.width = '0';
          setTimeout(() => {
            skill.style.width = width;
          }, 100);
        });
      });


      function scrolling(where){

        if(where === 'about'){
            window.scrollTo(0,800)

        }else if(where === 'projects'){
            window.scrollTo(0,1750)
        }else{
            window.scrollTo(0,2630)
        }

      }