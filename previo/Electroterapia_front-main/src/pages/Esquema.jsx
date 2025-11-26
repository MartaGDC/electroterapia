<IonPage>
  <IonContent className='' fullscreen>
    <IonGrid className='ion-no-padding'>
      <IonRow 
      style={{display: "flex"}} 
      className="ion-justify-content-center ion-no-padding ion-no-margin">
        {/* Parte izquierda */}
        <IonCol>
          <IonContent className='home-content'>
            <IonGrid className='grid-buttons '>
              {options.map((opt) => (
                <IonRow className='ion-justify-content-center'>
                  <IonButton 
                  className='menu-button' 
                  expand='block'
                  onClick={() => navigateButton(opt.path)}
                  >
                    {opt.name}
                  </IonButton>
                </IonRow>
            ))}
            </IonGrid>              
          </IonContent>
        </IonCol>
        {/* Parte derecha */}
        <IonCol className='ion-no-padding ion-no-margin'>
          <IonContent 
          className='home-content ion-no-margin' color="darkgreen">
            <IonIcon 
            className='settings-icon'
            icon={settingsOutline} 
            color='main' 
            onClick={() => navigateButton("/ajustes")}
            />
            <IonRow 
            style={{
              height: "100%", 
              display: "flex"
            }} 
            className='ion-align-items-center'
            >
              <IonTitle 
              className='titulo-login ion-no-margin ion-no-padding ion-text-center' 
              color={'blanco'}
              >
                ElectrUZherapy
              </IonTitle>
            </IonRow>
          </IonContent>
        </IonCol>
      </IonRow>  
    </IonGrid>
  </IonContent>
</IonPage>
