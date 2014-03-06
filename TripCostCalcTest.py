import unittest

class TestTripCost(unittest.TestCase):
	def setUp(self):
		self.TripCost = TripCost('The Trip Cost')
		
	def tearDown(self):
		self.TripCost.dispose()
		self.TripCost = None
	
	def test_vehicle(self):
		#test the vehicle data given to trip cost
	
	def test_gas(self):
		#test gas prices data
	
	def test_calculation(self):
		#test trip cost calculation
	
if __name__ == '__main__':
	unittest.main()