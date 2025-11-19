import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
import type { GetAvailabilityResponse } from '../application/dtos/GetAvailabilityResponse';
import { SERVICE_TYPE_VALUES } from '../application/dtos/GetAvailabilityResponse';
import type { ServiceType } from '../application/dtos/GetAvailabilityResponse';
import { format, parse } from 'date-fns'; // Importar funções para formatação/parsing de data
import { enUS, ptBR } from 'date-fns/locale'; // Importar locales para formatação

// --- Dados Mockados (Hardcoded) ---
// Simula a resposta do endpoint GET /api/booking/availability
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
    { start: "2025-12-02T09:00:00.000Z", end: "2025-12-02T09:30:00.000Z", is_available: false }, // Ocupado
    { start: "2025-12-02T09:30:00.000Z", end: "2025-12-02T10:00:00.000Z", is_available: false }, // Ocupado
    { start: "2025-12-02T16:00:00.000Z", end: "2025-12-02T16:30:00.000Z", is_available: false }, // Ocupado

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

const CalendarTest: React.FC = () => {
  // Estados para armazenar o tipo de serviço selecionado, datas e o dia selecionado
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | "">("");
  const [searchStartDateISO, setSearchStartDateISO] = useState<Date>(() => {
    if (mockAvailabilityData.time_slots.length === 0) {
      return new Date();
    }
    const earliestStart = new Date(mockAvailabilityData.time_slots[0].start);
    for (const slot of mockAvailabilityData.time_slots) {
      const slotStart = new Date(slot.start);
      if (slotStart < earliestStart) {
        earliestStart.setTime(slotStart.getTime()); // Atualiza earliestStart
      }
    }
    return earliestStart;
  });

  const [searchEndDateISO, setSearchEndDateISO] = useState<Date>(() => {
    if (mockAvailabilityData.time_slots.length === 0) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7); // Retorna hoje + 7 dias se não houver slots
      return futureDate;
    }
    const latestEnd = new Date(mockAvailabilityData.time_slots[0].end);
    for (const slot of mockAvailabilityData.time_slots) {
      const slotEnd = new Date(slot.end);
      if (slotEnd > latestEnd) {
        latestEnd.setTime(slotEnd.getTime()); // Atualiza latestEnd
      }
    }
    return latestEnd;
  });

 

  // Estado para armazenar os dados de disponibilidade simulados (mockados)
  const [availabilityData, setAvailabilityData] = useState<GetAvailabilityResponse | null>(null);

  // Estado para o locale detectado
  const [calendarLocale, setCalendarLocale] = useState<string>('en-US');
  const [dateFnsLocale, setDateFnsLocale] = useState(enUS); // Locale para date-fns

  // Efeito para detectar locale do navegador
  useEffect(() => {
    const browserLocale = navigator.language;
    const localeMap: Record<string, { dateFns: any; calendar: string }> = {
      'en-US': { dateFns: enUS, calendar: 'en-US' },
      'en-GB': { dateFns: enUS, calendar: 'en-GB' }, // date-fns enUS é geralmente suficiente para en-GB
      'pt-BR': { dateFns: ptBR, calendar: 'pt-BR' },
      'pt-PT': { dateFns: ptBR, calendar: 'pt-PT' }, // Usando ptBR para pt-PT também, ou ajuste se necessário
      'es-ES': { dateFns: enUS, calendar: 'es-ES' }, // date-fns não tem ES, usar enUS ou uma biblioteca específica
      'fr-FR': { dateFns: enUS, calendar: 'fr-FR' }, // date-fns não tem FR, usar enUS ou uma biblioteca específica
      'de-DE': { dateFns: enUS, calendar: 'de-DE' }, // date-fns não tem DE, usar enUS ou uma biblioteca específica
    };

    const mappedLocale = localeMap[browserLocale] || { dateFns: enUS, calendar: 'en-US' };
    setCalendarLocale(mappedLocale.calendar);
    setDateFnsLocale(mappedLocale.dateFns); // Define o locale para date-fns
  }, []);

   // Estados para datas formatadas (exibição no input)
  const [searchStartDateFormatted, setSearchStartDateFormatted] = useState<string>(
    format(searchStartDateISO, 'dd/MM/yyyy', { locale: dateFnsLocale }) // Formato inicial baseado no valor ISO e locale
  );
  const [searchEndDateFormatted, setSearchEndDateFormatted] = useState<string>(
    format(searchEndDateISO, 'dd/MM/yyyy', { locale: dateFnsLocale }) // Formato inicial baseado no valor ISO e locale
  );

  // Efeito para atualizar as datas formatadas quando as datas ISO mudam (ex: inicialização)
  useEffect(() => {
    setSearchStartDateFormatted(format(searchStartDateISO, 'dd/MM/yyyy', { locale: dateFnsLocale }));
  }, [searchStartDateISO, dateFnsLocale]);

  useEffect(() => {
    setSearchEndDateFormatted(format(searchEndDateISO, 'dd/MM/yyyy', { locale: dateFnsLocale }));
  }, [searchEndDateISO, dateFnsLocale]);

  // Função para aplicar máscara de data (DD/MM/YYYY) a uma string
  const applyDateMask = (value: string): string => {
    // Remove tudo que não é dígito
    const digitsOnly = value.replace(/\D/g, '');
    // Limita a 8 dígitos (DDMMAAAA)
    const truncated = digitsOnly.substring(0, 8);

    // Aplica a máscara DD/MM/YYYY
    let masked = '';
    if (truncated.length > 0) {
      masked += truncated.substring(0, 2); // Dia
    }
    if (truncated.length > 2) {
      masked += '/' + truncated.substring(2, 4); // Barra + Mês
    }
    if (truncated.length > 4) {
      masked += '/' + truncated.substring(4, 8); // Barra + Ano
    }

    return masked;
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value; // Valor digitado pelo usuário (pode incluir ou não os '/')
    const maskedValue = applyDateMask(rawValue); // Aplica a máscara
    setSearchStartDateFormatted(maskedValue); // Atualiza a exibição com a máscara

    // Tenta converter o valor formatado (com máscara) de volta para um objeto Date (ISO)
    // O formato esperado para parsing é dd/MM/yyyy
    // Apenas tenta parsear se o valor tiver o comprimento esperado (8 dígitos + 2 barras = 10 caracteres)
    if (maskedValue.length === 10) {
      const parsedDate = parse(maskedValue, 'dd/MM/yyyy', new Date(), { locale: dateFnsLocale });
      if (!isNaN(parsedDate.getTime())) { // Verifica se a conversão foi bem-sucedida
        setSearchStartDateISO(parsedDate);
      } else {
        // Opcional: Logar ou mostrar erro se a data for inválida
        console.error("Invalid date format for start date:", maskedValue);
        // Pode-se optar por limpar o estado ISO ou manter o anterior se a data for inválida
        // setSearchStartDateISO(prevState); // Exemplo: manter o valor anterior
      }
    } else if (maskedValue.length === 0) {
        // Se o campo estiver vazio, limpar o estado ISO correspondente
        setSearchStartDateISO(new Date()); // Ou algum valor padrão
    }
    // Não faz nada se o comprimento for < 10 e > 0 (ainda digitando)
  };

  // Função para lidar com a mudança na data de fim (input de texto com máscara)
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value; // Valor digitado pelo usuário (pode incluir ou não os '/')
    const maskedValue = applyDateMask(rawValue); // Aplica a máscara
    setSearchEndDateFormatted(maskedValue); // Atualiza a exibição com a máscara

    // Tenta converter o valor formatado (com máscara) de volta para um objeto Date (ISO)
    // O formato esperado para parsing é dd/MM/yyyy
    // Apenas tenta parsear se o valor tiver o comprimento esperado (8 dígitos + 2 barras = 10 caracteres)
    if (maskedValue.length === 10) {
      const parsedDate = parse(maskedValue, 'dd/MM/yyyy', new Date(), { locale: dateFnsLocale });
      if (!isNaN(parsedDate.getTime())) { // Verifica se a conversão foi bem-sucedida
        setSearchEndDateISO(parsedDate);
      } else {
        // Opcional: Logar ou mostrar erro se a data for inválida
        console.error("Invalid date format for end date:", maskedValue);
        // Pode-se optar por limpar o estado ISO ou manter o anterior se a data for inválida
        // setSearchEndDateISO(prevState); // Exemplo: manter o valor anterior
      }
    } else if (maskedValue.length === 0) {
        // Se o campo estiver vazio, limpar o estado ISO correspondente
        setSearchEndDateISO(new Date()); // Ou algum valor padrão
    }
    // Não faz nada se o comprimento for < 10 e > 0 (ainda digitando)
  };

  // --- Novo: Função para simular a busca de disponibilidade ---
  const handleSearchAvailability = () => {
    // Simular a chamada à API com os dados mockados
    // Neste exemplo, apenas copiamos os dados mockados
    // Em uma implementação real, aqui seria o fetch para /api/booking/availability
    console.log("Simulating API call to get availability for type:", selectedServiceType, "between", searchStartDateISO, "and", searchEndDateISO);

    // Filtrar os time_slots do mock para o tipo de serviço e intervalo de datas selecionados
    // Neste exemplo, os dados mockados já são para "consultation", então não filtramos por service_type aqui
    // Mas o filtro de intervalo de datas é importante
    const filteredTimeSlots = mockAvailabilityData.time_slots.filter(slot => {
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);

      // Verifica se o slot está dentro do intervalo [searchStartDateISO, searchEndDateISO)
      // Um slot está no intervalo se: slotStart < searchEndDateISO e slotEnd > searchStartDateISO
      // Isso cobre slots que começam antes, dentro ou depois do intervalo, mas têm sobreposição
      return slotStart < searchEndDateISO && slotEnd > searchStartDateISO;
    });

    // Filtrar os available_services do mock para o tipo de serviço selecionado
    const filteredAvailableServices = mockAvailabilityData.available_services.filter(service => {
      return service.service_type === selectedServiceType;
    });

    // Criar a resposta simulada com os dados filtrados
    const simulatedResponse: GetAvailabilityResponse = {
      service_type: selectedServiceType as ServiceType, // O tipo solicitado
      time_slots: filteredTimeSlots, // Slots filtrados por data
      available_services: filteredAvailableServices, // Serviços filtrados por tipo
    };

    // Armazenar os dados simulados no estado
    setAvailabilityData(simulatedResponse);

    console.log("Simulated availability data set:", simulatedResponse);
  };
  // ---

  // --- Função de Dia (modificada para usar availabilityData) ---
  const isDayWithAvailableSlots = (date: Date): boolean => {
    // Se não temos dados de disponibilidade ainda, nenhum dia tem slots
    if (!availabilityData) {
      return false;
    }

    // Converter a data do calendário para o início e fim do dia em ISO String (UTC)
    const dayStart = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0));
    const dayEnd = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999));

    // Verificar se *algum* slot *disponível* nos dados filtrados se sobrepõe ao dia
    return availabilityData.time_slots.some(slot => {
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);
      const slotIsAvailable = slot.is_available;

      // Verifica sobreposição com o DIA específico
      const overlapsWithDay = slotStart < dayEnd && slotEnd > dayStart;

      // Verifica se o slot está dentro do INTERVALO DE BUSCA
      // (Embora os slots já estejam filtrados por data no handleSearchAvailability, garantir aqui também é robusto)
      const isWithinSearchRange = slotStart < searchEndDateISO && slotEnd > searchStartDateISO;

      return slotIsAvailable && overlapsWithDay && isWithinSearchRange;
    });
  };

  const isDayInRange = (date: Date): boolean => {
    const dayStart = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0));
    const dayEnd = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999));

    return dayStart < searchEndDateISO && dayEnd >= searchStartDateISO;
  };
  // ---

  // Estados para seleção de dia, serviço e horário (parte da simulação de agendamento)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDayAvailable, setIsDayAvailable] = useState<boolean>(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<string | null>(null); // Armazena a string ISO do slot selecionado
  const [isBooking, setIsBooking] = useState<boolean>(false);

  const handleDayClick = (value: Date) => {
    if (isDayInRange(value)) {
        if (isDayWithAvailableSlots(value)) {
            console.log(`Selected day: ${value.toISOString().split('T')[0]}`);
            setSelectedDate(value);
            setIsDayAvailable(true);
            // Aqui você pode navegar para a próxima tela ou mostrar os horários
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

  // --- Funções de Seleção e Confirmação ---
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
      setSelectedDate(null); // Voltar para a seleção de datas/serviço

    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("An error occurred while confirming the appointment.");
    } finally {
      setIsBooking(false); // Desativa o estado de carregamento
    }
  };
  // ---




  // ... (restante do código do componente permanece o mesmo, incluindo os estados, useEffects, funções) ...

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Calendar Test - Availability</h2>
          <p className="text-gray-600 mb-6">
            This is a test using mocked data to demonstrate how the calendar can show availability.
          </p>

          {/* --- Formulário de Seleção (Sempre Visível) --- */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="serviceTypeSelect" className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type:
                </label>
                <select
                  id="serviceTypeSelect"
                  value={selectedServiceType || ''}
                  onChange={(e) => setSelectedServiceType(e.target.value as ServiceType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a type...</option>
                  {SERVICE_TYPE_VALUES.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="startDateInput" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date (DD/MM/YYYY):
                </label>
                <input
                  type="text"
                  id="startDateInput"
                  value={searchStartDateFormatted}
                  onChange={handleStartDateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="DD/MM/YYYY"
                />
              </div>
              <div>
                <label htmlFor="endDateInput" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (DD/MM/YYYY):
                </label>
                <input
                  type="text"
                  id="endDateInput"
                  value={searchEndDateFormatted}
                  onChange={handleEndDateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="DD/MM/YYYY"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleSearchAvailability}
                disabled={!selectedServiceType || !searchStartDateISO || !searchEndDateISO}
                className={`w-full px-4 py-2 rounded-md shadow-sm text-white font-medium ${
                  selectedServiceType && searchStartDateISO && searchEndDateISO
                    ? "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Search Availability
              </button>
            </div>
          </div>
          {/* --- Fim do Formulário de Seleção --- */}

          {/* --- Calendário e Detalhes (Exibidos após busca) --- */}
          {availabilityData && ( // <-- Mostra o calendário e detalhes APENAS SE houver dados de disponibilidade
            <div>
              {/* Calendário */}
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                <Calendar
                  onChange={() => {}}
                  value={null}
                  tileClassName={tileClassName}
                  tileDisabled={tileDisabled}
                  onClickDay={handleDayClick}
                  locale={calendarLocale}
                  minDate={searchStartDateISO}
                  maxDate={searchEndDateISO}
                  className="w-full"
                />
              </div>

              {/* Detalhes do Dia Selecionado */}
              {selectedDate && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Details for {selectedDate.toLocaleDateString()}:
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Status: <span className={isDayAvailable ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                      {isDayAvailable ? 'Available' : 'Unavailable (in range)'}
                    </span>
                  </p>
                  {isDayAvailable && (
                    <div>
                      <h4 className="text-md font-medium text-gray-800 mb-2">Available Services: (Select one)</h4>
                      <ul className="space-y-2">
                        {availabilityData.available_services.map((service, index) => (
                          <li
                            key={`service-${index}`}
                            onClick={() => handleServiceSelect(service.id)}
                            className={`cursor-pointer bg-white p-3 rounded border ${
                              selectedServiceId === service.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:bg-gray-50"
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

                      <h4 className="text-md font-medium text-gray-800 mb-1 mt-4">Available Times: (Select one)</h4>
                      <ul className="mb-4 space-y-2">
                        {availabilityData.time_slots
                          .filter(slot => {
                            const slotStart = new Date(slot.start);
                            const slotDate = new Date(slotStart.getFullYear(), slotStart.getMonth(), slotStart.getDate());
                            const selectedDateWithoutTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
                            return slotDate.getTime() === selectedDateWithoutTime.getTime() && slot.is_available && slotStart < searchEndDateISO && slotStart >= searchStartDateISO;
                          })
                          .map((slot, index) => (
                            <li
                              key={index}
                              onClick={() => handleTimeSlotSelect(slot.start)}
                              className={`cursor-pointer bg-white p-2 rounded border ${
                                selectedDateTime === slot.start
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </li>
                          ))}
                      </ul>

                      <div className="mt-6">
                        <button
                          onClick={handleConfirmAppointment}
                          disabled={!selectedServiceId || !selectedDateTime || isBooking}
                          className={`w-full px-4 py-2 rounded-md shadow-sm text-white font-medium ${
                            selectedServiceId && selectedDateTime && !isBooking
                              ? "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              : "bg-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {isBooking ? "Confirming..." : "Confirm Appointment"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {/* --- Fim do Calendário e Detalhes --- */}
        </div>
      </div>
    </div>
  );
};

export default CalendarTest;