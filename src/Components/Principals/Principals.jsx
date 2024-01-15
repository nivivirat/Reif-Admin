import { onValue, ref, push, set, remove, update, get } from 'firebase/database';
import { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import PrincipalsCard from './PrincipalsComponents/PrincipalsCard';
import NewCardForm from './PrincipalsComponents/NewForm';
import EditForm from './PrincipalsComponents/EditForm';
import ExtrusionMachineryCard from './PrincipalsComponents/ExtrusionMachineryCard';
import { Icon } from '@iconify/react';

export default function Principals() {
    const [principalsData, setPrincipalsData] = useState({});
    const [newCardForm, setNewCardForm] = useState({
        company_name: "",
        img: null,
        backContent: "",
        back2: "",
        back3: "",
        backLink: ""
    });
    const [isOpen, setIsOpen] = useState(false);
    const [currentSection, setCurrentSection] = useState("");
    const [editingCardId, setEditingCardId] = useState(null);
    const [isAddingNewCard, setIsAddingNewCard] = useState(false);

    const [changeSectionOrder, setChangeSectionOrder] = useState(false);
    const [changeCardsOrder, setChangeCardsOrder] = useState(false);

    // Add these lines with your other state declarations
    const [isEditingReifenhauserMachinary, setIsEditingReifenhauserMachinary] = useState(false);
    const [editingReifenhauserMachinaryData, setEditingReifenhauserMachinaryData] = useState(null);
    const [editingReifenhauserMachinaryDataID, setEditingReifenhauserMachinaryDataID] = useState(null);

    const [isAddingReifenhauserMachinary, setIsAddingReifenhauserMachinary] = useState(false);

    useEffect(() => {
        const reff = ref(db, 'principals');
        onValue(reff, (snapshot) => {
            setPrincipalsData(snapshot.val());
        });
    }, []);

    const addNewCard = (section) => {
        let newCardData = {
            ...newCardForm,
            id: null, // Set to null initially
        };

        if (editingCardId) {
            // Editing existing card
            const cardRef = ref(db, `principals/${section}/${editingCardId}`);
            newCardData.id = editingCardId; // Set the ID for editing
            set(cardRef, newCardData);
            setEditingCardId(null); // Reset editing state
        } else {
            // Adding new card
            const sectionRef = ref(db, `principals/${section}`);
            const sectionData = principalsData[section];
            const order = sectionData ? Object.keys(sectionData).length : 0;

            // Assign order to the new card
            newCardData.order = order;

            // Set the ID for the new card
            const newCardRef = push(sectionRef);
            newCardData.id = newCardRef.key;

            set(ref(db, `principals/${section}/${newCardData.id}`), newCardData);
        }

        // Reset form and state
        setNewCardForm({
            company_name: "",
            img: null,
            backContent: "",
            back2: "",
            back3: "",
            backLink: "",
        });

        setEditingCardId(null); // Reset editing state
        setIsOpen(false);
        setIsAddingNewCard(false);
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setNewCardForm({
                    ...newCardForm,
                    img: event.target.result,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setNewCardForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleEditClick = (cardId) => {
        let sectionKey = null;
        let cardData = null;

        // Find the section and card data
        Object.keys(principalsData).forEach((section) => {
            if (principalsData[section] && principalsData[section][cardId]) {
                sectionKey = section;
                cardData = principalsData[section][cardId];
                return;
            }
        });

        if (cardData) {
            setNewCardForm({
                ...cardData,
                img: cardData.img || null,
            });
            setEditingCardId(cardId);
            setCurrentSection(sectionKey);
            setIsOpen(true);
            setIsAddingNewCard(false); // Set to false to indicate editing
        } else {
            console.error(`Card data not found for cardId: ${cardId}`);
        }
    };

    const handleDeleteClick = (cardId) => {
        if (window.confirm('Are you sure you want to delete this card?')) {
            Object.keys(principalsData).forEach((section) => {
                if (principalsData[section] && principalsData[section][cardId]) {
                    const cardRef = ref(db, `principals/${section}/${cardId}`);
                    remove(cardRef);
                }
            });
        }
    };

    const handleAddSectionClick = () => {
        const newSectionName = prompt('Enter the name for the new section:');
        if (newSectionName) {
            const sectionRef = ref(db, `principals/${newSectionName}`);
            const newCardRef = push(sectionRef);
            const newCardKey = newCardRef.key;

            setCurrentSection(newSectionName);
            setIsOpen(true);
            setIsAddingNewCard(true);
        }
    };

    const handleOrderChange = (section, cardId, newOrder) => {
        if (newOrder === "" || isNaN(newOrder)) {
            // If new order is empty or not a number, do nothing
            return;
        }

        const cardRef = ref(db, `principals/${section}/${cardId}`);
        update(cardRef, { order: newOrder });
    };

    const handleSectionOrderChange = (sectionId) => {
        const newOrder = prompt(`Enter the new order for ${sectionId}:`);
        if (newOrder !== null && !isNaN(newOrder)) {
            const sectionRef = ref(db, `principals/${sectionId}`);
            update(sectionRef, { s_order: parseInt(newOrder, 10) });
        }
    };

    const handleReifMachinaryEdit = (cardId) => {
        const section = 'Reifenhauser Machinary';
        const cardData = principalsData[section][cardId];

        if (cardData) {
            setEditingReifenhauserMachinaryDataID(cardId);
            setEditingReifenhauserMachinaryData(cardData);
            setIsEditingReifenhauserMachinary(true);
        } else {
            console.error(`Card data not found for cardId: ${cardId}`);
        }
    };

    const initialCardData = {
        heading: '',
        sub: '',
        link: '',
        id: null
        // Add other fields as needed
    };


    function handleAddReifenhauserMachinaryCard(section) {
        setEditingReifenhauserMachinaryData(initialCardData);
        setIsAddingReifenhauserMachinary(true);
    }

    return (
        <div className="container mx-auto p-4">
            <div>
                {/* <button
                    className="ml-4 bg-green-500 text-white py-1 px-2 rounded"
                    onClick={handleAddSectionClick}
                >
                    Add Section
                </button> */}
                <button
                    className="ml-4 bg-primary text-white py-1 px-2 rounded"
                    onClick={() => setChangeSectionOrder(true)}
                >
                    Change order of section
                </button>
            </div>
            {Object.entries(principalsData)
                .sort(([, a], [, b]) => a.s_order - b.s_order) // Sort sections based on order
                .map(([section, sectionData]) => (
                    <div key={section} className="mb-8 relative my-10 mt-[100px]">
                        <div className='flex flex-row justify-between mr-[100px] my-10'>
                            <div>
                                <p className="text-primary font-semibold lg:text-[40px] my-5 text-[35px]">{section}</p>

                            </div>
                            <div className='my-5'>
                                <button
                                    className="ml-4 bg-primary text-white py-1 px-2 rounded"
                                    onClick={() => {
                                        if (section === 'Reifenhauser Machinary') {
                                            // Use a different method or form for Reifenhauser Machinary
                                            setCurrentSection(section);
                                            handleAddReifenhauserMachinaryCard(section);
                                        } else {
                                            // Use the default method for other sections
                                            setCurrentSection(section);
                                            setIsOpen(true);
                                            setIsAddingNewCard(true);
                                        }
                                    }}

                                >
                                    Add Card
                                </button>
                                <button
                                    className="ml-2 bg-primary text-white py-1 px-2 rounded"
                                    onClick={() => {
                                        setChangeCardsOrder(true);
                                        setCurrentSection(section);
                                    }}
                                >
                                    Change Order
                                </button>
                            </div>
                        </div>
                        <div className="grid lg:grid-cols-4 grid-cols-2 lg:grid-flow-row gap-10">
                            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> */}
                            {Object.entries(sectionData)
                                .filter(([key]) => key !== 's_order') // Exclude the section order field
                                .sort(([, a], [, b]) => a.order - b.order) // Sort cards based on order
                                .map(([itemId, item]) => (
                                    <div key={itemId}>
                                        {section === 'Reifenhauser Machinary' ? (
                                            <ExtrusionMachineryCard
                                                key={itemId}
                                                id={itemId}
                                                heading={item.heading}
                                                sub={item.sub}
                                                link={item.link}
                                                onDelete={() => handleDeleteClick(itemId)}
                                                onEdit={() => handleReifMachinaryEdit(itemId)}
                                                onOrderChange={(newOrder) => handleOrderChange(section, itemId, newOrder)}
                                            />
                                        ) : (
                                            <PrincipalsCard
                                                key={itemId}
                                                id={itemId}
                                                onEdit={() => handleEditClick(itemId)}
                                                onDelete={() => handleDeleteClick(itemId)}
                                                onOrderChange={(newOrder) => handleOrderChange(section, itemId, newOrder)}
                                                {...item}
                                            />
                                        )}
                                    </div>
                                ))}


                        </div>
                        {isAddingNewCard ? (
                            <NewCardForm
                                isOpen={isOpen}
                                topic={"Add New Card"}
                                onClose={() => setIsOpen(false)}
                                onAddCard={addNewCard}
                                section={currentSection}
                                newCardForm={newCardForm}
                                handleFormChange={handleFormChange}
                                handleFileChange={handleFileChange}
                            />
                        ) : (
                            <EditForm
                                isOpen={isOpen}
                                topic={"Edit Card"}
                                onClose={() => setIsOpen(false)}
                                onEditCard={() => addNewCard(currentSection)}
                                section={currentSection}
                                newCardForm={newCardForm}
                                handleFormChange={handleFormChange}
                                handleFileChange={handleFileChange}
                            />
                        )}
                    </div>
                ))}
            {changeSectionOrder ? (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold mb-2">Change Section Order</h2>
                            <p className="text-sm text-primary">
                                (Enter new numeric orders for each section. The sections will be ordered in ascending order based on the entered numbers.)
                            </p>
                        </div>
                        <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => setChangeSectionOrder(false)}
                        >
                            <Icon icon="ph:x-bold" />
                        </button>
                    </div>
                    {Object.entries(principalsData)
                        .sort(([, a], [, b]) => a.s_order - b.s_order)
                        .map(([section, sectionData]) => (
                            <div key={section} className="mb-4 flex items-center">
                                <span className="mr-4 text-gray-600">{section}:</span>
                                <input
                                    type="number"
                                    className="px-3 py-1 border border-gray-300 rounded-md"
                                    value={sectionData.s_order}
                                    onChange={(e) => {
                                        const newOrder = parseInt(e.target.value, 10);
                                        if (!isNaN(newOrder)) {
                                            const sectionRef = ref(db, `principals/${section}`);
                                            update(sectionRef, { s_order: newOrder });
                                        }
                                    }}
                                />
                            </div>
                        ))}
                    <button
                        className="bg-primary text-white py-2 px-4 rounded-md"
                        onClick={() => setChangeSectionOrder(false)}
                    >
                        Save Changes
                    </button>
                </div>
            ) : (
                <div></div>
            )}


            {changeCardsOrder ? (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-md">
                    <div className="flex justify-between place-items-start mb-4">
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold mb-2">Change Cards Order in Section: {currentSection}</h2>
                            <p className="text-sm text-primary">
                                (Enter new numeric orders for each card. The cards will be ordered in ascending order based on the entered numbers.)
                            </p>
                        </div>
                        <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => setChangeCardsOrder(false)}
                        >
                            <Icon icon="ph:x-bold" />
                        </button>
                    </div>
                    <div className='h-[300px] overflow-y-scroll py-5'>
                        {Object.entries(principalsData[currentSection])
                            .filter(([key]) => key !== 's_order')
                            .sort(([, a], [, b]) => a.order - b.order)
                            .map(([itemId, item]) => (
                                <div key={itemId} className="flex items-center mb-4">
                                    <span className="mr-4 text-gray-600">
                                        {currentSection === 'Reifenhauser Machinary' ? (
                                            <p className="font-semibold">{item.heading}:</p>
                                        ) : (
                                            <p className="font-semibold">{item.company_name}:</p>
                                        )}
                                    </span>
                                    <div className="flex items-center">
                                        {/* <span className="text-gray-600">Order:</span> */}
                                        <input
                                            type="number"
                                            // className="px-3 py-1 border border-gray-300 rounded-md"
                                            className="px-3 py-1 border border-gray-300 rounded-md"
                                            value={item.order}
                                            onChange={(e) => {
                                                const newOrder = parseInt(e.target.value, 10);
                                                if (!isNaN(newOrder)) {
                                                    const cardRef = ref(db, `principals/${currentSection}/${itemId}`);
                                                    update(cardRef, { order: newOrder });
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                    </div>
                    <button
                        className="bg-primary text-white py-2 px-4 rounded-md mt-3"
                        onClick={() => setChangeCardsOrder(false)}
                    >
                        Save Changes
                    </button>
                </div>
            ) : (
                <div></div>
            )}



            {isEditingReifenhauserMachinary && editingReifenhauserMachinaryData && (
                <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-md'>
                    <div className='flex flex-row justify-between mb-4'>
                        <h2 className="text-xl font-bold">Edit Reifenhauser Machinary Card</h2>
                        <button
                            className="text-gray-500 hover:text-gray-700 ml-10"
                            onClick={() => setIsEditingReifenhauserMachinary(false)}
                        >
                            <Icon icon="ph:x-bold" />
                        </button>
                    </div>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="heading" className="block text-sm font-medium text-gray-600">Heading</label>
                            <input
                                type="text"
                                id="heading"
                                name="heading"
                                value={editingReifenhauserMachinaryData.heading}
                                onChange={(e) => setEditingReifenhauserMachinaryData({ ...editingReifenhauserMachinaryData, heading: e.target.value })}
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="sub" className="block text-sm font-medium text-gray-600">Sub</label>
                            <input
                                type="text"
                                id="sub"
                                name="sub"
                                value={editingReifenhauserMachinaryData.sub}
                                onChange={(e) => setEditingReifenhauserMachinaryData({ ...editingReifenhauserMachinaryData, sub: e.target.value })}
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="link" className="block text-sm font-medium text-gray-600">Link</label>
                            <input
                                type="text"
                                id="link"
                                name="link"
                                value={editingReifenhauserMachinaryData.link}
                                onChange={(e) => setEditingReifenhauserMachinaryData({ ...editingReifenhauserMachinaryData, link: e.target.value })}
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="bg-primary text-white py-2 px-4 rounded-md"
                                onClick={() => {
                                    // Handle the form submission here
                                    const updatedCardData = {
                                        heading: editingReifenhauserMachinaryData.heading,
                                        sub: editingReifenhauserMachinaryData.sub,
                                        link: editingReifenhauserMachinaryData.link,
                                    };

                                    // You may want to include validation before updating the card
                                    // ...

                                    // Update the card data in the database using the update function
                                    const cardRef = ref(db, `principals/Reifenhauser Machinary/${editingReifenhauserMachinaryDataID}`);
                                    update(cardRef, updatedCardData);

                                    // Reset the editing state
                                    setIsEditingReifenhauserMachinary(false);
                                }}
                            >
                                Save Changes
                            </button>
                        </div>

                    </form>
                </div>
            )}


            {isAddingReifenhauserMachinary && (
                <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-md'>
                    <div className='flex flex-row justify-between mb-4'>
                        <h2 className="text-xl font-bold">Add Reifenhauser Machinary Card</h2>
                        <button
                            className="text-gray-500 hover:text-gray-700 ml-10"
                            onClick={() => setIsAddingReifenhauserMachinary(false)}
                        >
                            <Icon icon="ph:x-bold" />
                        </button>
                    </div>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="heading" className="block text-sm font-medium text-gray-600">Heading</label>
                            <input
                                type="text"
                                id="heading"
                                name="heading"
                                value={editingReifenhauserMachinaryData.heading || ""}
                                onChange={(e) => setEditingReifenhauserMachinaryData({ ...editingReifenhauserMachinaryData, heading: e.target.value })}
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="sub" className="block text-sm font-medium text-gray-600">Sub</label>
                            <input
                                type="text"
                                id="sub"
                                name="sub"
                                value={editingReifenhauserMachinaryData.sub || ""}
                                onChange={(e) => setEditingReifenhauserMachinaryData({ ...editingReifenhauserMachinaryData, sub: e.target.value })}
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="link" className="block text-sm font-medium text-gray-600">Link</label>
                            <input
                                type="text"
                                id="link"
                                name="link"
                                value={editingReifenhauserMachinaryData.link || ""}
                                onChange={(e) => setEditingReifenhauserMachinaryData({ ...editingReifenhauserMachinaryData, link: e.target.value })}
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="bg-primary text-white py-2 px-4 rounded-md"
                                onClick={async () => {
                                    // Fetch existing cards
                                    const cardsRef = ref(db, 'principals/Reifenhauser Machinary');
                                    const snapshot = await get(cardsRef);
                                    const existingCards = snapshot.val() || {};

                                    // Determine the order for the new card
                                    const order = Object.keys(existingCards).length;

                                    // Include order in the new card data
                                    const newCardData = {
                                        heading: editingReifenhauserMachinaryData.heading,
                                        sub: editingReifenhauserMachinaryData.sub,
                                        link: editingReifenhauserMachinaryData.link,
                                        order: order,
                                    };

                                    // Add the new card data to the database
                                    const newCardRef = push(cardsRef);
                                    set(newCardRef, newCardData);

                                    // Reset the form state
                                    setEditingReifenhauserMachinaryData(initialCardData);
                                    setIsAddingReifenhauserMachinary(false);
                                }}
                            >
                                Save Changes
                            </button>

                        </div>
                    </form>
                </div>
            )}





        </div>
    );
}