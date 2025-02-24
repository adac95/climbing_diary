import { useState } from 'react';
import CountryForm from './CountryForm';
import RegionForm from './RegionForm';
import PlaceForm from './PlaceForm';
import SectorForm from './SectorForm';
import CampingForm from './CampingForm';
import ApproachForm from './ApproachForm';
import LodgeForm from './LodgeForm';
import StyleForm from './StyleForm';
import RouteForm from './RouteForm';
import DeveloperForm from './DeveloperForm';
import RouteDeveloperForm from './RouteDeveloperForm';
import SectorStyleForm from './SectorStyleForm';

export default function FormWizard() {
  const [step, setStep] = useState(0);
  const [wizardData, setWizardData] = useState({});

  const nextStep = (data) => {
    setWizardData(prev => ({ ...prev, ...data }));
    setStep(prev => prev + 1);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <CountryForm onNext={nextStep} />;
      case 1:
        return <RegionForm countryId={wizardData.countryId} onNext={nextStep} />;
      case 2:
        return <PlaceForm regionId={wizardData.regionId} onNext={nextStep} />;
      case 3:
        return <SectorForm placeId={wizardData.placeId} onNext={nextStep} />;
      case 4:
        return <CampingForm placeId={wizardData.placeId} onNext={nextStep} />;
      case 5:
        return <ApproachForm placeId={wizardData.placeId} onNext={nextStep} />;
      case 6:
        return <LodgeForm placeId={wizardData.placeId} onNext={nextStep} />;
      case 7:
        return <StyleForm onNext={nextStep} />;
      case 8:
        return <RouteForm sectorId={wizardData.sectorId} styleId={wizardData.styleId} onNext={nextStep} />;
      case 9:
        return <DeveloperForm onNext={nextStep} />;
      case 10:
        return <RouteDeveloperForm routeId={wizardData.routeId} developerId={wizardData.developerId} onNext={nextStep} />;
      case 11:
        return <SectorStyleForm sectorId={wizardData.sectorId} styleId={wizardData.styleId} onNext={nextStep} />;
      default:
        return <p>Todos los formularios han sido completados.</p>;
    }
  };

  return <div>{renderStep()}</div>;
}
