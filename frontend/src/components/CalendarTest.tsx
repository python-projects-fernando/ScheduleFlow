import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
import type { GetAvailabilityResponse } from '../application/dtos/GetAvailabilityResponse';

const mockAvailabilityData: GetAvailabilityResponse = {
  service_type: "consultation",
  time_slots: [
    // --- 30/11/2025 ---
    { start: "2025-11-30T09:00:00.000Z", end: "2025-11-30T09:30:00.000Z", is_available: true },
    { start: "2025-11-30T09:30:00.000Z", end: "2025-11-30T10:00:00.000Z", is_available: true },
    { start: "2025-11-30T10:00:00.000Z", end: "2025-11-30T10:30:00.000Z", is_available: false }, // Ocupado
    { start: "2025-11-30T10:30:00.000Z", end: "2025-11-30T11:00:00.000Z", is_available: true },
    { start: "2025-11-30T14:00:00.000Z", end: "2025-11-30T14:30:00.000Z", is_available: true },
    { start: "2025-11-30T14:30:00.000Z", end: "2025-11-30T15:00:00.000Z", is_available: false }, // Ocupado

    // --- 01/12/2025 ---
    { start: "2025-12-01T10:00:00.000Z", end: "2025-12-01T10:30:00.000Z", is_available: true },
    { start: "2025-12-01T10:30:00.000Z", end: "2025-12-01T11:00:00.000Z", is_available: true },
    { start: "2025-12-01T11:00:00.000Z", end: "2025-12-01T11:30:00.000Z", is_available: true },
    { start: "2025-12-01T15:00:00.000Z", end: "2025-12-01T15:30:00.000Z", is_available: false }, // Ocupado

    // --- 02/12/2025 ---
    { start: "2025-12-02T09:00:00.000Z", end: "2025-12-02T09:30:00.000Z", is_available: true },
    { start: "2025-12-02T09:30:00.000Z", end: "2025-12-02T10:00:00.000Z", is_available: false }, // Ocupado
    { start: "2025-12-02T16:00:00.000Z", end: "2025-12-02T16:30:00.000Z", is_available: true },

    // --- 03/12/2025 ---
    { start: "2025-12-03T11:00:00.000Z", end: "2025-12-03T11:30:00.000Z", is_available: true },
    { start: "2025-12-03T11:30:00.000Z", end: "2025-12-03T12:00:00.000Z", is_available: true },
    { start: "2025-12-03T12:00:00.000Z", end: "2025-12-03T12:30:00.000Z", is_available: false }, // Ocupado

    // --- 04/12/2025 ---
    { start: "2025-12-04T13:00:00.000Z", end: "2025-12-04T13:30:00.000Z", is_available: true },
    { start: "2025-12-04T13:30:00.000Z", end: "2025-12-04T14:00:00.000Z", is_available: true },
    { start: "2025-12-04T14:00:00.000Z", end: "2025-12-04T14:30:00.000Z", is_available: true },

    // --- 05/12/2025 ---
    { start: "2025-12-05T10:00:00.000Z", end: "2025-12-05T10:30:00.000Z", is_available: false }, // Ocupado
    { start: "2025-12-05T10:30:00.000Z", end: "2025-12-05T11:00:00.000Z", is_available: true },

    // --- 06/12/2025 ---
    { start: "2025-12-06T09:00:00.000Z", end: "2025-12-06T09:30:00.000Z", is_available: true },
    { start: "2025-12-06T09:30:00.000Z", end: "2025-12-06T10:00:00.000Z", is_available: true },
    { start: "2025-12-06T10:00:00.000Z", end: "2025-12-06T10:30:00.000Z", is_available: true },
    { start: "2025-12-06T14:00:00.000Z", end: "2025-12-06T14:30:00.000Z", is_available: false }, // Ocupado

    // --- 07/12/2025 ---
    { start: "2025-12-07T15:00:00.000Z", end: "2025-12-07T15:30:00.000Z", is_available: true },
    { start: "2025-12-07T15:30:00.000Z", end: "2025-12-07T16:00:00.000Z", is_available: true },

    // --- 08/12/2025 ---
    { start: "2025-12-08T11:00:00.000Z", end: "2025-12-08T11:30:00.000Z", is_available: false }, // Ocupado
    { start: "2025-12-08T11:30:00.000Z", end: "2025-12-08T12:00:00.000Z", is_available: true },
    { start: "2025-12-08T12:00:00.000Z", end: "2025-12-08T12:30:00.000Z", is_available: true },

    // --- 09/12/2025 ---
    { start: "2025-12-09T10:00:00.000Z", end: "2025-12-09T10:30:00.000Z", is_available: true },
    { start: "2025-12-09T10:30:00.000Z", end: "2025-12-09T11:00:00.000Z", is_available: true },
    { start: "2025-12-09T11:00:00.000Z", end: "2025-12-09T11:30:00.000Z", is_available: true },
    { start: "2025-12-09T11:30:00.000Z", end: "2025-12-09T12:00:00.000Z", is_available: false }, // Ocupado

    // --- 10/12/2025 ---
    { start: "2025-12-10T09:00:00.000Z", end: "2025-12-10T09:30:00.000Z", is_available: true },
    { start: "2025-12-10T09:30:00.000Z", end: "2025-12-10T10:00:00.000Z", is_available: true },
    { start: "2025-12-10T14:00:00.000Z", end: "2025-12-10T14:30:00.000Z", is_available: true },
    { start: "2025-12-10T14:30:00.000Z", end: "2025-12-10T15:00:00.000Z", is_available: true },

  ],
  available_services: [
    {
      id: "service-1",
      name: "Cardiology Consultation",
      description: "Initial consultation focusing on cardiovascular diagnosis.",
      duration_minutes: 60,
      price: 200.0,
      service_type: "consultation",
      created_at: "2024-01-01T00:00:00.000Z",
      updated_at: "2024-01-01T00:00:00.000Z"
    },
    {
      id: "service-2",
      name: "Dermatology Consultation",
      description: "Consultation for skin condition diagnosis and treatment.",
      duration_minutes: 45,
      price: 180.0,
      service_type: "consultation",
      created_at: "2024-01-01T00:00:00.000Z",
      updated_at: "2024-01-01T00:00:00.000Z"
    }
  ]
};
// --- Fim dos Dados Mockados ---
// ... (restante do código do componente permanece o mesmo) ...

const CalendarTest: React.FC = () => {
  const [searchStartDate, setSearchStartDate] = useState<Date>(() => {
    if (mockAvailabilityData.time_slots.length === 0) {
      return new Date();
    }
    const earliestStart = new Date(mockAvailabilityData.time_slots[0].start);
    for (const slot of mockAvailabilityData.time_slots) {
      const slotStart = new Date(slot.start);
      if (slotStart < earliestStart) {
        earliestStart.setTime(slotStart.getTime());
      }
    }
    return earliestStart;
  });

  const [searchEndDate, setSearchEndDate] = useState<Date>(() => {
    if (mockAvailabilityData.time_slots.length === 0) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      return futureDate;
    }
    const latestEnd = new Date(mockAvailabilityData.time_slots[0].end);
    for (const slot of mockAvailabilityData.time_slots) {
      const slotEnd = new Date(slot.end);
      if (slotEnd > latestEnd) {
        latestEnd.setTime(slotEnd.getTime());
      }
    }
    return latestEnd;
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDayAvailable, setIsDayAvailable] = useState<boolean>(false);

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<string | null>(null); // Armazena a string ISO do slot selecionado
  const [isBooking, setIsBooking] = useState<boolean>(false);

  const isDayWithAvailableSlots = (date: Date): boolean => {
    const dayStart = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0));
    const dayEnd = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999));

    return mockAvailabilityData.time_slots.some(slot => {
      const slotStart = new Date(slot.start);
      return slotStart >= dayStart && slotStart <= dayEnd && slot.is_available;
    });
  };

  const isDayInRange = (date: Date): boolean => {
    const dayStart = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0));
    const dayEnd = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999));

    return dayStart < searchEndDate && dayEnd >= searchStartDate;
  };

  const handleDayClick = (value: Date) => {
    if (isDayInRange(value)) {
        if (isDayWithAvailableSlots(value)) {
            console.log(`Selected day: ${value.toISOString().split('T')[0]}`);
            setSelectedDate(value);
            setIsDayAvailable(true);
            alert(`You selected the day ${value.toLocaleDateString()}. This day has available times.`);
        } else {
            console.log(`Day ${value.toISOString().split('T')[0]} is within the range, but not available.`);
            setSelectedDate(null);
            setIsDayAvailable(false);
            alert(`The day ${value.toLocaleDateString()} is within the search range, but has no available times.`);
        }
    } else {
        console.log(`Click on day ${value.toISOString().split('T')[0]} was ignored (out of range).`);
        alert(`This day (${value.toLocaleDateString()}) is not part of the current search range.`);
    }
  };

  const tileClassName = ({ date, view }: { date: Date; view: 'month' | 'year' | 'decade' | 'century' }) => {
    if (view === 'month') {
      if (!isDayInRange(date)) {
        return 'react-calendar__tile--out-of-range';
      } else if (isDayWithAvailableSlots(date)) {
        return 'react-calendar__tile--available';
      } else {
        return 'react-calendar__tile--unavailable';
      }
    }
    return '';
  };

  const tileDisabled = ({ date, view }: { date: Date; view: 'month' | 'year' | 'decade' | 'century' }) => {
    if (view === 'month') {
      return !isDayInRange(date);
    }
    return false;
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      setSearchStartDate(newDate);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      setSearchEndDate(newDate);
    }
  };

  // ... dentro do componente CalendarTest ...
const handleServiceSelect = (serviceId: string) => {
  setSelectedServiceId(serviceId);
  // Opcional: Deselecionar o horário se o serviço mudar
  // setSelectedDateTime(null);
};

const handleTimeSlotSelect = (timeSlotStart: string) => { // Recebe o start do slot como string ISO
  setSelectedDateTime(timeSlotStart);
  // Opcional: Deselecionar o serviço se o horário mudar (se quiser obrigar a selecionar serviço primeiro)
  // setSelectedServiceId(null);
};

const handleConfirmAppointment = async () => {
  if (!selectedServiceId || !selectedDateTime) {
    console.warn("Service ID or DateTime not selected yet.");
    return;
  }

  setIsBooking(true); // Ativa o estado de carregamento

  try {
    // Simular uma chamada à API (por enquanto apenas um delay e log)
    console.log("Attempting to book appointment...");
    console.log("- Selected Service ID:", selectedServiceId);
    console.log("- Selected Date Time:", selectedDateTime);
    // Aqui viria a chamada real para a API:
    // const response = await bookAppointmentAPI({ service_id: selectedServiceId, requested_datetime: selectedDateTime });
    // if (response.success) { ... } else { ... }

    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simular sucesso
    console.log("Appointment booked successfully!");
    alert(`Appointment confirmed for ${new Date(selectedDateTime).toLocaleString()} with service ID ${selectedServiceId}.`);

    // Limpar seleções após confirmação (opcional)
    setSelectedServiceId(null);
    setSelectedDateTime(null);

  } catch (error) {
    console.error("Error booking appointment:", error);
    alert("An error occurred while confirming the appointment.");
  } finally {
    setIsBooking(false); // Desativa o estado de carregamento
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Calendar Test - Availability</h2>
          <p className="text-gray-600 mb-6">
            This is a test using mocked data to demonstrate how the calendar can show availability.
          </p>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
              <div className="flex-1">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date (Mock):
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={searchStartDate.toISOString().split('T')[0]}
                  onChange={handleStartDateChange}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (Mock):
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={searchEndDate.toISOString().split('T')[0]}
                  onChange={handleEndDateChange}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* --- CORREÇÃO AQUI --- */}
          {/* Adicionado um contêiner com w-full para garantir que o calendário ocupe toda a largura */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Calendar
              onChange={() => {}}
              value={null}
              tileClassName={tileClassName}
              tileDisabled={tileDisabled}
              onClickDay={handleDayClick}
              locale="en-US"
              minDate={searchStartDate}
              maxDate={searchEndDate}
              className="w-full" // <-- Esta classe garante que o calendário interno ocupe toda a largura do seu contêiner
            />
          </div>
          {/* --- FIM DA CORREÇÃO --- */}

          {selectedDate && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Details for {selectedDate.toLocaleDateString()}:
              </h3>
              <p className="text-gray-700 mb-4">
                Status: <span className={isDayAvailable ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                  {isDayAvailable ? 'Available' : 'Unavailable (in range)'}
                </span>
              </p>
              {isDayAvailable && selectedDate && (
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-2">Available Times: (Select one)</h4>
                  <ul className="mb-4 space-y-1">
                    {mockAvailabilityData.time_slots
                      .filter(slot => {
                        const slotStart = new Date(slot.start);
                        const slotDate = new Date(slotStart.getFullYear(), slotStart.getMonth(), slotStart.getDate());
                        const selectedDateWithoutTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
                        return slotDate.getTime() === selectedDateWithoutTime.getTime() && slot.is_available;
                      })
                      .map((slot, index) => (
                        <li
                          key={index}
                          onClick={() => handleTimeSlotSelect(slot.start)} // Chama a função ao clicar
                          className={`cursor-pointer bg-white p-2 rounded border ${
                            selectedDateTime === slot.start // Verifica se este slot está selecionado
                              ? "border-blue-500 bg-blue-50" // Estilo para selecionado
                              : "border-gray-200 hover:bg-gray-50" // Estilo padrão e hover
                          }`}
                        >
                          {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </li>
                      ))}
                  </ul>
                  
                  
                  <h4 className="text-md font-medium text-gray-800 mb-2">Available Services: (Select one)</h4>
                  <ul className="space-y-2">
                    {mockAvailabilityData.available_services.map((service, index) => (
                      <li
                        key={`service-${index}`}
                        onClick={() => handleServiceSelect(service.id)} // Chama a função ao clicar
                        className={`cursor-pointer bg-white p-3 rounded border ${
                          selectedServiceId === service.id // Verifica se este serviço está selecionado
                            ? "border-blue-500 bg-blue-50" // Estilo para selecionado
                            : "border-gray-200 hover:bg-gray-50" // Estilo padrão e hover
                        } shadow-sm`}
                      >
                        <div className="font-medium text-gray-900">{service.name}</div>
                        <div className="text-sm text-gray-600 italic mt-1">{service.description}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          ({service.duration_minutes} min) - R$ {service.price?.toFixed(2)}
                        </div>
                      </li>
                    ))}
                  </ul>
                  {/* --- Botão de Confirmação --- */}
                  <div className="mt-6">
                    <button
                      onClick={handleConfirmAppointment} // Chama a função de confirmação
                      disabled={!selectedServiceId || !selectedDateTime || isBooking} // Desabilita se não houver seleção ou estiver carregando
                      className={`w-full px-4 py-2 rounded-md shadow-sm text-white font-medium ${
                        selectedServiceId && selectedDateTime && !isBooking
                          ? "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {isBooking ? "Confirming..." : "Confirm Appointment"} {/* Mostra texto de loading se necessário */}
                    </button>
                  </div>



                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarTest;