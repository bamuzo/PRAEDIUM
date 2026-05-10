  # Praedium

  # Please use this link to enter the prototype.
    https://matrix-window-36224470.figma.site/

  # Choice of Case Study
  We chose Case Study #1, Vertical farming, as it is an interesting concept that delves into both software and hardware,
  Based on our research, surprisingly, vertical farms rarely ever use soil and rely on hydroponics/water systems to assist plant growth, as well as LED lighting
  instead of sunlight.

  # Project Proposal
  
  Our proposal is the application "Praedium", an app that assists vertical farmers in wirelessly tracking and controlling their farm, while also using AI to save on energy.

  The main issues within Vertical farming are energy usage and plant health, as well as water usage, although Vertical farming is extremely efficient in terms of hydro criteria.
  As mentioned before, our application would use an AI to warn the farmer of water outages, control the lights automatically, and track important metrics for vertical farms
  such as temperature, Humidity, Light levels, and nutrients within the water used.

  For said metrics, we shall use an Arduino ESP32, with attachments such as the DHT22, a sensor used to precisely detect humidity & temperatures. And the LDR, a light-dependent resistor,
  used to measure the amount of Lux, and finally, a total dissolved solids sensor, and an electric conductivity probe, to calculate and approximate neutrients within the water. 


  The current simulator used to test said hardware could only provide the DHT22, and LDR  to test, as well as a wi-fi-less option of Arduino nano, but nonetheless it assisted
  in understanding the hardware components.

  <img width="898" height="479" alt="image" src="https://github.com/user-attachments/assets/d3f2b5c5-f48a-4cf2-abaf-016b25cff969" />

  The code is within a separate file within the source.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
